import { LogEntry } from "./log-entry";

/**
 * Defines the writer contract used by output transports (e.g. console, file).
 * Each method corresponds to a rendering instruction from the logger core.
 *
 * This interface is implemented by custom outputs and is never used directly by end-users.
 */
export interface ILogoraWriter {
  /**
   * Processes and renders a structured log entry.
   * This method is called for all standard log messages (info, error, etc.).
   *
   * @param logEntry The full structured log entry to display.
   */
  log(logEntry: LogEntry): void;

  /**
   * Prints a stylized title or section header.
   * This method is used for visual grouping and does not include timestamps or levels.
   *
   * @param title The text to display as a section title.
   */
  title(title: string): void;

  /**
   * Outputs one or more blank lines to separate log sections.
   *
   * @param count Number of empty lines to insert (defaults to 1).
   */
  empty(count?: number): void;

  /**
   * Clears the output target (e.g., clears the console screen).
   * Optional and output-dependent.
   */
  clear(): void;

  /**
   * Writes a raw message without log level, timestamp, or formatting.
   * Used for unstructured logs, debugging, or passive output.
   *
   * @param message A template string with placeholders (e.g. `{0}`, `{1}`).
   * @param args Optional values to substitute into the message.
   */
  print(message: string, ...args: unknown[]): void;
}
