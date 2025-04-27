import { LogoraConfig } from "../config/logora.config";
import { LogLevel } from "../enums/level.enum";
import { LogType } from "../enums/type.enum";
import { ILogoraOutput } from "../models/logora-output.interface";
import { ILogora } from "../models/logora.interface";
import { LogEntry } from "./log-entry";

/**
 * Core implementation of the Logora logger.
 * 
 * Handles structured logging, output filtering, queueing, and asynchronous dispatch
 * of log entries to one or more registered outputs.
 * 
 * This class implements the ILogora public interface and can be scoped, extended,
 * or used in combination with multiple output transports.
 */
export class LogoraCore implements ILogora {
  /**
   * Registered log output transports (e.g., console, file, remote).
   */
  private _outputs: ILogoraOutput[] = [];

  /**
   * Internal queue of pending log operations to dispatch.
   * Each entry is a callback that invokes the appropriate output logic.
   */
  private _queue: (() => void)[] = [];

  /**
   * Flag indicating whether the queue is currently being flushed.
   */
  private flushing = false;

  /**
   * Optional scope label attached to all entries from this logger instance.
   */
  private _scope?: { label: string };

  /**
   * Timestamp of the last log emitted (used by outputs for spacing/context).
   */
  private _lastLogDate = new Date();

  /**
   * Logger configuration instance used for output control and error handling.
   */
  private _config: LogoraConfig;

  /**
   * Mapping of log levels to numeric values used for filtering.
   */
  private readonly logLevels = {
    [LogLevel.Error]: 0,
    [LogLevel.Warning]: 1,
    [LogLevel.Success]: 2,
    [LogLevel.Info]: 3,
    [LogLevel.Debug]: 4,
  };

  /**
   * Constructs a new logger instance with optional configuration.
   * Loads output transports and applies level formatting logic.
   *
   * @param config Partial logger configuration.
   */
  constructor(config?: Partial<LogoraConfig>) {
    this._lastLogDate.setDate(this._lastLogDate.getDate() - 1);
    this._config = new LogoraConfig(config);
    this._outputs = this._config.outputs ?? [];
  }

  /** @inheritdoc */
  title(title: string): void {
    this._outputs.forEach((output) => {
      this._enqueue(() => output.writer.title(title));
    });
    this.flush();
  }

  /** @inheritdoc */
  empty(count?: number): void {
    this._outputs.forEach((output) => {
      this._enqueue(() => output.writer.empty(count));
    });
    this.flush();
  }

  /** @inheritdoc */
  clear(): void {
    this._outputs.forEach((output) => {
      this._enqueue(() => output.writer.clear());
    });
    this.flush();
  }

  /** @inheritdoc */
  print(message: string, ...args: unknown[]): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      type: LogType.Raw,
      message,
      args,
      scope: this._scope?.label,
    };

    this._outputs.forEach((output) => {
      this._enqueue(() => output.writer.log(entry), entry);
    });
    this.flush();
  }

  /** @inheritdoc */
  info(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Info, message, args);
    this._filterAndDispatch(LogLevel.Info, entry);
  }

  /** @inheritdoc */
  warning(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Warning, message, args);
    this._filterAndDispatch(LogLevel.Warning, entry);
  }

  /** @inheritdoc */
  error(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Error, message, args);
    this._filterAndDispatch(LogLevel.Error, entry);
  }

  /** @inheritdoc */
  success(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Success, message, args);
    this._filterAndDispatch(LogLevel.Success, entry);
  }

  /** @inheritdoc */
  debug(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Debug, message, args);
    this._filterAndDispatch(LogLevel.Debug, entry);
  }

  /** @inheritdoc */
  highlight(message: string, ...args: unknown[]): void {
    const entry = this._createEntry(LogType.Highlight, message, args);
    this._outputs.forEach((output) => {
      this._enqueue(() => output.writer.log(entry), entry);
    });
    this.flush();
  }

  /** @inheritdoc */
  log(type: LogType, message: string, ...args: unknown[]): void {
    switch (type) {
      case LogType.Raw: return this.print(message, ...args);
      case LogType.Info: return this.info(message, ...args);
      case LogType.Warning: return this.warning(message, ...args);
      case LogType.Error: return this.error(message, ...args);
      case LogType.Success: return this.success(message, ...args);
      case LogType.Debug: return this.debug(message, ...args);
      case LogType.Highlight: return this.highlight(message, ...args);
      default: return this.print(message, ...args);
    }
  }

  /** @inheritdoc */
  getScoped(scope: string): ILogora {
    const scoped = new LogoraCore(this._config);
    scoped._scope = { label: scope };
    scoped._outputs = this._outputs;
    scoped._lastLogDate = this._lastLogDate;

    return scoped;
  }

  /** @inheritdoc */
  addLogOutput(output: ILogoraOutput): void {
    this._outputs.push(output);
  }

  /**
   * Flushes the internal log queue asynchronously using `queueMicrotask`.
   * Ensures non-blocking dispatch of log operations.
   * Catches and reports any output errors using the configured onError hook.
   */
  private flush(): void {
    if (this.flushing) return;

    this.flushing = true;
    queueMicrotask(() => {
      while (this._queue.length > 0) {
        const event = this._queue.shift()!;
        try {
          event();
        } catch (error) {
          const fallbackEntry: LogEntry = {
            timestamp: new Date(),
            type: LogType.Error,
            message: "Logora flush error",
            args: [error],
            scope: this._scope?.label
          };
          this._config.onError?.(error, fallbackEntry);
        }
      }
      this.flushing = false;
    });
  }

  /**
   * Adds a log operation to the queue.
   * Enforces the configured queue limit and triggers onDrop if necessary.
   *
   * @param callback The output action to execute.
   * @param entry Optional log entry for drop monitoring.
   */
  private _enqueue(callback: () => void, entry?: LogEntry): void {
    if (
      this._config.queueLimit &&
      this._queue.length >= this._config.queueLimit
    ) {
      if (entry) {
        this._config.onDrop?.(entry);
      }
      return;
    }

    this._queue.push(callback);
  }

  /**
   * Creates a structured LogEntry instance with current timestamp and scope.
   *
   * @param type The semantic type of the log.
   * @param message The message template.
   * @param args Arguments to inject into the message.
   * @returns A complete LogEntry object.
   */
  private _createEntry(type: LogType, message: string, args: unknown[]): LogEntry {
    return {
      timestamp: new Date(),
      type,
      message,
      args,
      scope: this._scope?.label,
    };
  }

  /**
   * Dispatches a log entry to all outputs respecting their minimum log level.
   *
   * @param level The severity level used for filtering.
   * @param entry The log entry to enqueue.
   */
  private _filterAndDispatch(level: LogLevel, entry: LogEntry): void {
    this._outputs.forEach((output) => {
      if (this.logLevels[output.options.level || this._config.level] >= this.logLevels[level]) {
        this._enqueue(() => output.writer.log(entry), entry);
      }
    });
    this.flush();
  }
}

