import { ConsoleColor, LogLevel } from "../enums";

export class LogoraConfig {
  colors = {
    text: ConsoleColor.Reset,
    title: ConsoleColor.Bright,
    date: ConsoleColor.Gray,
    success: ConsoleColor.Green,
    warning: ConsoleColor.Yellow,
    info: ConsoleColor.Cyan,
    debug: ConsoleColor.Gray,
    error: ConsoleColor.Red,
    highlight: ConsoleColor.Magenta,
    emphasis: ConsoleColor.White
  };

  level: LogLevel = LogLevel.Info;
  logsDateFormat = 'MMMM Do YYYY, hh:mm:ss';
  logTimestampFormat = 'HH:mm:ss';

  constructor(config?: Partial<LogoraConfig>) {
    Object.assign(this, config);
  }
}
