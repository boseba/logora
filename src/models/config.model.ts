import { ConsoleColor } from "../enums/console.enum";
import { LogLevel } from "../enums/level.enum";

export class LogoraConfig {
  colors: {
    text: ConsoleColor;
    title: ConsoleColor;
    date: ConsoleColor;
    success: ConsoleColor;
    warning: ConsoleColor;
    info: ConsoleColor;
    debug: ConsoleColor;
    error: ConsoleColor;
    highlight: ConsoleColor;
    emphasis: ConsoleColor;
  };
  level: LogLevel = LogLevel.Info;
  logsDateFormat: string = 'MMMM Do YYYY, hh:mm:ss';
  logTimestampFormat: string = 'HH:mm:ss';

  constructor() {
    this.colors = {
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
    }
  }
}