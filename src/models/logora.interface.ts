import { ConsoleColor, LogLevel } from "../enums";

/**
 * ILogora defines the public API for the Logora logger.
 * This interface can be used for dependency injection, mocking, or extension.
 */
export interface ILogora {
  /**
   * Logs an informational message.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Logs a warning message.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  warning(message: string, ...args: unknown[]): void;

  /**
   * Logs an error message. Always visible regardless of log level.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * Logs a debug message. Useful for development and diagnostics.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  debug(message: string, ...args: unknown[]): void;

  /**
   * Logs a success message.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  success(message: string, ...args: unknown[]): void;

  /**
   * Logs a message with strong emphasis and color.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  highlight(message: string, ...args: unknown[]): void;

  /**
   * Prints a styled title line (without timestamp or level).
   * @param title The title text.
   */
  title(title: string): void;

  /**
   * Prints one or more empty lines to the console.
   * @param count Number of lines to print (default is 1).
   */
  empty(count?: number): void;

  /**
   * Clears the console output.
   */
  clear(): void;

  /**
   * Prints a raw formatted message without log level prefix.
   * @param message A string template using placeholders like {0}, {1}, etc.
   * @param args Values to inject into the message.
   */
  print(message: string, ...args: unknown[]): void;

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
  logAtLevel(level: LogLevel, message: string, ...args: unknown[]): void;

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
  getScoped(scope: string, color?: ConsoleColor): ILogora;
}
