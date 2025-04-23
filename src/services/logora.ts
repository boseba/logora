import moment from "moment";
import { LogLevel } from "../enums/level.enum";
import { LogoraConfig } from "../models/logora.config";
import { ILogora } from "../models/logora.interface";
import { ConsoleColor } from "../enums";

/**
 * Logora is a customizable logger with color support, levels, and templated messages.
 */
export class Logora implements ILogora {
  config: LogoraConfig;

  private _lastLogDate = new Date();
  private _scope?: { label: string; color: ConsoleColor };

  private readonly logLevels = {
    [LogLevel.Error]: 0,
    [LogLevel.Warning]: 1,
    [LogLevel.Success]: 2,
    [LogLevel.Info]: 3,
    [LogLevel.Debug]: 4,
  };

  /**
   * Creates a new instance of Logora with optional configuration overrides.
   * @param config Partial configuration to override default behavior.
   */
  constructor(config?: Partial<LogoraConfig>) {
    this._lastLogDate.setDate(this._lastLogDate.getDate() - 1);
    this.config = new LogoraConfig(config);
  }

  /**
   * Returns a new logger instance scoped with the given context label.
   *
   * The returned instance will automatically prefix all messages with the specified scope.
   * Optionally, you can define a custom color for the scope label. If omitted, the default
   * color defined in `LogoraConfig.colors.scope` will be used.
   *
   * This method does not modify the current logger instance.
   *
   * @param scope - The scope label (e.g. "Auth", "DB", "HTTP") to prefix log entries with.
   * @param color - Optional ANSI color code for the scope label (e.g. ConsoleColor.Magenta).
   * @returns A new scoped instance of the logger.
   */
  getScoped(scope: string, color?: ConsoleColor): ILogora {
    const scoped = new Logora(this.config);
    scoped._lastLogDate = this._lastLogDate;
    scoped.setScope(scope, color);

    return scoped;
  }

  /**
   * Internally sets the scope label and resolved color for the current logger instance.
   *
   * If no color is provided, the default scope color defined in `LogoraConfig.colors.scope` is used.
   * This is used internally by `getScoped()` and should not be called directly.
   *
   * @param scope - The scope label to apply (e.g. "Auth", "HTTP").
   * @param color - Optional ANSI color code to colorize the scope label.
   */
  private setScope(scope: string, color?: ConsoleColor): void {
    this._scope = { label: scope, color: color ?? this.config.colors.scope };
  }

  /**
   * Logs an informational message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Info)) return;
    this.log(
      this.compose("Info", this.config.colors.info, message, args)
    );
  }

  /**
   * Logs a warning message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  warning(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Warning)) return;
    this.log(
      this.compose("Warning", this.config.colors.warning, message, args)
    );
  }

  /**
   * Logs an error message. Always shown regardless of log level.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  error(message: string, ...args: unknown[]): void {
    this.log(
      this.compose("Error", this.config.colors.error, message, args)
    );
  }

  /**
   * Logs a success message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  success(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Success)) return;
    this.log(
      this.compose("Success", this.config.colors.success, message, args)
    );
  }

  /**
   * Logs a debug message, useful for development.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Debug)) return;
    this.log(
      this.compose(
        "Debug",
        this.config.colors.debug,
        message,
        args,
        this.config.colors.emphasis
      )
    );
  }

  /**
   * Logs a highlighted message (always shown).
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  highlight(message: string, ...args: unknown[]): void {
    this.log(
      this.compose(
        "Highlight",
        this.config.colors.highlight,
        message,
        args,
        this.config.colors.emphasis
      )
    );
  }

  /**
   * Prints a styled title line to the console.
   * @param title The title string.
   */
  title(title: string): void {
    console.log(this.colorize(title, this.config.colors.title));
  }

  /**
   * Prints empty lines to the console.
   * @param count Number of lines (default: 1).
   */
  empty(count: number = 1): void {
    console.log("\n".repeat(count - 1));
  }

  /**
   * Clears the console.
   */
  clear(): void {
    console.clear();
  }

  /**
   * Prints a raw message with optional formatting (no prefix/level).
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  print(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Info)) return;
    const str = this.format(message, args, this.config.colors.info);
    console.log(str);
  }

  /**
   * Logs a message dynamically based on the given log level.
   *
   * This method delegates to the appropriate specific method (e.g. info, warning, error),
   * ensuring consistent formatting and behavior across the library.
   *
   * @param level - The log level to use (e.g. LogLevel.Info, LogLevel.Error).
   * @param message - A templated message string, optionally including placeholders like `{0}`, `{1}`, etc.
   * @param args - Values to inject into the message template.
   */
  logAtLevel(level: LogLevel, message: string, ...args: unknown[]): void {
    switch (level) {
      case LogLevel.Error:
        this.error(message, ...args);
        break;
      case LogLevel.Warning:
        this.warning(message, ...args);
        break;
      case LogLevel.Success:
        this.success(message, ...args);
        break;
      case LogLevel.Info:
        this.info(message, ...args);
        break;
      case LogLevel.Debug:
        this.debug(message, ...args);
        break;
      default:
        this.highlight(message, ...args);
        break;
    }
  }

  /**
   * Determines whether a log at the given level should be shown.
   * @param level The log level.
   */
  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[this.config.level] >= this.logLevels[level];
  }

  /**
   * Formats a message by applying the scope (if any), the log level label,
   * and injecting arguments into the message template.
   *
   * @param label - The log level label (e.g. "Info", "Error").
   * @param color - The color to apply to the label.
   * @param message - The templated message to log.
   * @param args - Optional arguments to inject into the message.
   * @param valueColor - Optional color for the injected values.
   * @returns A fully formatted log message string.
   */
  private compose(
    label: string,
    color: string,
    message: string,
    args: unknown[],
    valueColor?: string
  ): string {
    const formatted = this.format(message, args, valueColor ?? color);

    const scopePart = this._scope
      ? `[${this.colorize(this._scope.label, this._scope.color)}]`
      : "";

    const labelPart = this.colorize(label, color);

    return `${scopePart} ${labelPart}: ${formatted}`.trim();
  }

  /**
   * Replaces placeholders in the message with provided arguments.
   * @param message The message template (e.g. "User {0} logged in").
   * @param args Arguments to insert.
   * @param valueColor Color to apply to each value.
   */
  private format(message: string, args: unknown[], valueColor: string): string {
    return message.replace(
      /{(\d+)}/g,
      (match: string, index: string): string => {
        const value = args[+index];
        return typeof value !== "undefined"
          ? this.colorize(String(value), valueColor)
          : match;
      }
    );
  }

  /**
   * Handles the actual logging to the console, with date formatting.
   * @param message The formatted message.
   */
  private log(message: string): void {
    const date = new Date();
    if (date.getDay() !== this._lastLogDate.getDay()) {
      // It's a new day, print a separator
      console.log(
        "\n\n" +
          this.colorize(
            moment().format(this.config.logsDateFormat),
            this.config.colors.emphasis
          ) +
          "\n"
      );
    }

    console.log(
      `[${this.colorize(
        moment().format(this.config.logTimestampFormat),
        this.config.colors.date
      )}] ${message}`
    );
    this._lastLogDate = date;
  }

  /**
   * Applies color to the text if useColors is enabled.
   * @param text The text to colorize.
   * @param color The ANSI color code to use.
   * @returns The styled or raw text.
   */
  private colorize(text: string, color: string): string {
    return this.config.useColors
      ? `${color}${text}${this.config.colors.text}`
      : text;
  }
}
