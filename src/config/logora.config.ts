import { LogLevel } from "../enums/level.enum";
import { LogEntry } from "../core/log-entry";
import { ILogoraOutput } from "../models/logora-output.interface";

/**
 * Configuration object for the Logora logger core.
 * Defines the default behavior, formatting, output transports, and resilience strategies.
 */
export class LogoraConfig {
  /**
   * Minimum log level to accept.
   * Entries below this level may be ignored, depending on output filtering logic.
   * Defaults to LogLevel.Info.
   */
  level: LogLevel = LogLevel.Info;

  /**
   * Registered output transports.
   * Each output receives log entries and is responsible for filtering, formatting, and rendering them.
   */
  outputs: ILogoraOutput[] = [];

  /**
   * Maximum number of queued log events before new entries are dropped.
   * If undefined, the queue is unbounded.
   */
  queueLimit: number = 1000;

  /**
   * Optional hook triggered when an output writer throws an exception.
   * Allows for custom error reporting or fallback behavior.
   *
   * @param error The exception thrown by the output.
   * @param entry The log entry that caused the failure.
   */
  onError?: (error: unknown, entry: LogEntry) => void;

  /**
   * Optional hook triggered when a log entry is dropped due to queue overflow.
   *
   * @param entry The log entry that was discarded.
   */
  onDrop?: (entry: LogEntry) => void;

  /**
   * Creates a new LogoraConfig instance.
   * All provided values are merged with the defaults using shallow assignment.
   *
   * @param config Optional user-defined configuration overrides.
   */
  constructor(config?: Partial<LogoraConfig>) {
    Object.assign(this, config);
  }
}

