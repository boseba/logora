import { LogLevel } from "../enums";

/**
 * Defines output-level configuration options used by a Logora transport.
 * Each output can be configured individually to control verbosity and formatting.
 */
export interface ILogoraOutputOptions {
  /**
   * Minimum log level for this output.
   * Entries below this level will be ignored by this specific output.
   */
  level: LogLevel;

  /**
   * Format string used to render timestamps.
   * Outputs can use this to customize how the log time appears (e.g., "HH:mm:ss").
   */
  timestampFormat: string;
}
