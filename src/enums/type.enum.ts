/**
 * Semantic types of log entries handled by Logora.
 * These values describe the intent or category of a log message.
 *
 * Outputs can style and filter logs based on their type.
 */
export enum LogType {
  /**
   * Diagnostic messages for debugging purposes.
   * Typically disabled in production.
   */
  Debug,

  /**
   * Informational messages about application state or flow.
   * Used for general-purpose logs that do not indicate problems.
   */
  Info,

  /**
   * Messages that indicate successful operations.
   * Often styled positively to confirm completion.
   */
  Success,

  /**
   * Messages that indicate errors or failures.
   * Typically highlighted and always visible, regardless of log level.
   */
  Error,

  /**
   * Warnings about potential issues or non-blocking problems.
   * Draws attention but does not indicate critical failure.
   */
  Warning,

  /**
   * Special messages meant to draw the user’s attention.
   * Displayed regardless of the configured log level.
   * Used for banners, alerts, or emphasized messages.
   */
  Highlight,

  /**
   * Raw, unstructured output.
   * Printed as-is, without prefix, level, or formatting.
   * Useful for technical dumps or passive output.
   */
  Raw
}
