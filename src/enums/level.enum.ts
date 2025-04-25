/**
 * Log levels represent the severity or importance of log messages.
 * These values are used primarily for filtering output visibility.
 *
 * Each output defines a minimum log level, and entries below that level are ignored.
 */
export enum LogLevel {
  /**
   * Diagnostic logs intended for developers.
   * Very verbose; typically disabled in production environments.
   */
  Debug = "debug",

  /**
   * Informational logs about the normal flow of the application.
   * Useful for monitoring state or reporting standard activity.
   */
  Info = "info",

  /**
   * Logs indicating successful operations.
   * Can be used to confirm outcomes or highlight positive results.
   */
  Success = "success",

  /**
   * Logs indicating an error or failure.
   * Always considered important and usually shown in all environments.
   */
  Error = "error",

  /**
   * Logs used to warn about non-critical issues or risky situations.
   * Important but not fatal.
   */
  Warning = "warn"
}
