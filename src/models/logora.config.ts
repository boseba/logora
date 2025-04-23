import { ConsoleColor, LogLevel } from "../enums";

/**
 * LogoraConfig defines the configuration options available for the Logora logger.
 * You can customize colors, log level filtering, and date/time formats.
 */
export class LogoraConfig {
  /**
   * ANSI color codes used to display various parts of the log output.
   * You can override individual colors by providing a partial `colors` object.
   */
  colors = {
    /** Default text color (reset to terminal default) */
    text: ConsoleColor.Reset,
    /** Color used for titles */
    title: ConsoleColor.Bright,
    /** Color used for timestamps */
    date: ConsoleColor.Gray,
    /** Color used for success messages */
    success: ConsoleColor.Green,
    /** Color used for warnings */
    warning: ConsoleColor.Yellow,
    /** Color used for informational messages */
    info: ConsoleColor.Cyan,
    /** Color used for debug messages */
    debug: ConsoleColor.Gray,
    /** Color used for errors */
    error: ConsoleColor.Red,
    /** Color used for emphasized messages */
    highlight: ConsoleColor.Magenta,
    /** Color used for values inserted into templates */
    emphasis: ConsoleColor.White
  };

  /**
   * Defines the minimum log level required for a message to be displayed.
   * Messages below this level will be ignored.
   * Default: LogLevel.Info
   */
  level: LogLevel = LogLevel.Info;

  /**
   * Moment.js date format string used for displaying full dates in logs.
   * Default: 'MMMM Do YYYY, hh:mm:ss'
   */
  logsDateFormat = 'MMMM Do YYYY, hh:mm:ss';

  /**
   * Moment.js date format string used for displaying time next to each log entry.
   * Default: 'HH:mm:ss'
   */
  logTimestampFormat = 'HH:mm:ss';

  /**
   * Enables or disables ANSI color codes in the console output.
   * Set to `false` to produce plain text logs (e.g., for CI environments or log files).
   * 
   * @default true
   */
  useColors = true;

  /**
   * Creates a new LogoraConfig instance, optionally overriding default values.
   * @param config Partial configuration object to override defaults.
   */
  constructor(config?: Partial<LogoraConfig>) {
    Object.assign(this, config);
  }
}
