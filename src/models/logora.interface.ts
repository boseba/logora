import { LogType } from "../enums/type.enum";
import { ILogoraOutput } from "./logora-output.interface";

/**
 * Public interface of the Logora logger.
 * Provides structured and scoped logging methods for application developers.
 *
 * All methods support message templating using placeholders like `{0}`, `{1}`, etc.
 */
export interface ILogora {
  /**
   * Logs a message at the "info" level.
   * Commonly used for general application events.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Logs a message at the "warning" level.
   * Typically used to highlight potential issues or soft failures.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  warning(message: string, ...args: unknown[]): void;

  /**
   * Logs a message at the "error" level.
   * Used to report application errors. Usually always rendered regardless of log level.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * Logs a message at the "debug" level.
   * Useful during development to trace internal state or execution paths.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  debug(message: string, ...args: unknown[]): void;

  /**
   * Logs a message at the "success" level.
   * Can be used to confirm operations or indicate positive outcomes.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  success(message: string, ...args: unknown[]): void;

  /**
   * Logs a message dynamically using the specified log type.
   * Internally delegates to the corresponding method (e.g., `info`, `error`, etc.).
   *
   * @param type The semantic log type (info, debug, error, etc.).
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  log(type: LogType, message: string, ...args: unknown[]): void;

  /**
   * Prints a formatted title or section header.
   * Outputs typically display this without timestamp, log level, or scope.
   *
   * @param title The header text to display.
   */
  title(title: string): void;

  /**
   * Inserts one or more empty lines in the output.
   * Useful for visual separation of log blocks.
   *
   * @param count Number of blank lines to insert (defaults to 1).
   */
  empty(count?: number): void;

  /**
   * Clears the current output.
   * Behavior may vary by transport (e.g., clears terminal screen in console outputs).
   */
  clear(): void;

  /**
   * Outputs a raw message without applying formatting, level, or timestamp.
   * Intended for direct messaging or diagnostics.
   *
   * @param message Message template to render.
   * @param args Values to interpolate into the message.
   */
  print(message: string, ...args: unknown[]): void;

  /**
   * Returns a new logger instance scoped with the provided label.
   * The scope is attached to all future log entries and may be styled by the output.
   *
   * @param scope A label representing a functional context (e.g., "DB", "Auth").
   * @returns A new scoped logger that preserves the current configuration.
   */
  getScoped(scope: string): ILogora;

    /**
   * Dynamically adds a new log output transport to the logger instance.
   * 
   * The added output will immediately start receiving all future log entries.
   * This method can be used to attach additional outputs at runtime
   * without recreating a new logger.
   *
   * @param output The output transport to add, implementing `ILogoraOutput`.
   */
    addLogOutput(output: ILogoraOutput): void;
}
