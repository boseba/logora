import moment from "moment";
import { LogLevel } from "../enums/level.enum";
import { LogoraConfig } from "../models/logora.config";
import { ILogora } from "../models/logora.interface";

/**
 * Logora is a customizable logger with color support, levels, and templated messages.
 */
export class Logora implements ILogora {
  config: LogoraConfig;
  
  private _lastLogDate = new Date();

  private readonly logLevels = {
    [LogLevel.Error]: 0,
    [LogLevel.Warning]: 1,
    [LogLevel.Success]: 2,
    [LogLevel.Info]: 3,
    [LogLevel.Debug]: 4
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
   * Logs an informational message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Info)) return;
    this.log(this.formatWithLabel("Info", this.config.colors.info, message, args));
  }

  /**
   * Logs a warning message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  warning(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Warning)) return;
    this.log(this.formatWithLabel("Warning", this.config.colors.warning, message, args));
  }

  /**
   * Logs an error message. Always shown regardless of log level.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  error(message: string, ...args: unknown[]): void {
    this.log(this.formatWithLabel("Error", this.config.colors.error, message, args));
  }

  /**
   * Logs a success message.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  success(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Success)) return;
    this.log(this.formatWithLabel("Success", this.config.colors.success, message, args));
  }

  /**
   * Logs a debug message, useful for development.
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Debug)) return;
    this.log(this.formatWithLabel("Debug", this.config.colors.debug, message, args, this.config.colors.emphasis));
  }

  /**
   * Logs a highlighted message (always shown).
   * @param message The message template.
   * @param args Optional dynamic values for templating.
   */
  highlight(message: string, ...args: unknown[]): void {
    this.log(this.formatWithLabel("Highlight", this.config.colors.highlight, message, args, this.config.colors.emphasis));
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
   * Determines whether a log at the given level should be shown.
   * @param level The log level.
   */
  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[this.config.level] >= this.logLevels[level];
  }

  /**
   * Formats a message with a level label and color.
   * @param label The log label (e.g. "Info").
   * @param color Color for the label.
   * @param message Message template.
   * @param args Arguments to insert in the template.
   * @param valueColor Optional color for the values.
   */
  private formatWithLabel(label: string, color: string, message: string, args: unknown[], valueColor?: string): string {
    const formatted = this.format(message, args, valueColor ?? color);
    return `${this.colorize(label, color)}: ${formatted}`;
  }

  /**
   * Replaces placeholders in the message with provided arguments.
   * @param message The message template (e.g. "User {0} logged in").
   * @param args Arguments to insert.
   * @param valueColor Color to apply to each value.
   */
  private format(message: string, args: unknown[], valueColor: string): string {
    return message.replace(/{(\d+)}/g, (match: string, index: string): string => {
      const value = args[+index];
      return typeof value !== "undefined"
        ? this.colorize(String(value), valueColor)
        : match;
    });
  }

  /**
   * Handles the actual logging to the console, with date formatting.
   * @param message The formatted message.
   */
  private log(message: string): void {
    const date = new Date();
    if (date.getDay() !== this._lastLogDate.getDay()) {
      // It's a new day, print a separator 
      console.log('\n\n' + this.colorize(moment().format(this.config.logsDateFormat), this.config.colors.emphasis) + '\n');
    }

    console.log(`[${this.colorize(moment().format(this.config.logTimestampFormat), this.config.colors.date)}] ${message}`);
    this._lastLogDate = date;
  }

  /**
   * Applies color to the text if useColors is enabled.
   * @param text The text to colorize.
   * @param color The ANSI color code to use.
   * @returns The styled or raw text.
   */
  private colorize(text: string, color: string): string {
    return this.config.useColors ? `${color}${text}${this.config.colors.text}` : text;
  }
}
