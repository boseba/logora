import moment from "moment";
import { LogLevel } from "../enums/level.enum";
import { LogoraConfig } from "../models/logora.config";
import { ILogora } from "../models/logora.interface";

export class Logora implements ILogora {
  private _config: LogoraConfig;
  private _lastLogDate = new Date();

  private readonly logLevels = {
    [LogLevel.Error]: 0,
    [LogLevel.Warning]: 1,
    [LogLevel.Success]: 2,
    [LogLevel.Info]: 3,
    [LogLevel.Debug]: 4
  };

  constructor(config?: Partial<LogoraConfig>) {
    this._lastLogDate.setDate(this._lastLogDate.getDate() - 1);
    this._config = new LogoraConfig(config);
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Info)) return;
    this.log(this.formatWithLabel("Info", this._config.colors.info, message, args));
  }

  warning(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Warning)) return;
    this.log(this.formatWithLabel("Warning", this._config.colors.warning, message, args));
  }

  error(message: string, ...args: unknown[]): void {
    this.log(this.formatWithLabel("Error", this._config.colors.error, message, args));
  }

  success(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Success)) return;
    this.log(this.formatWithLabel("Success", this._config.colors.success, message, args));
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Debug)) return;
    this.log(this.formatWithLabel("Debug", this._config.colors.debug, message, args, this._config.colors.emphasis));
  }

  highlight(message: string, ...args: unknown[]): void {
    this.log(this.formatWithLabel("Highlight", this._config.colors.highlight, message, args, this._config.colors.emphasis));
  }

  title(title: string): void {
    console.log(`${this._config.colors.title}${title}${this._config.colors.text}`);
  }

  empty(count: number = 1): void {
    console.log("\n".repeat(count - 1));
  }

  clear(): void {
    console.clear();
  }

  print(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.Info)) return;
    const str = this._format(message, args, this._config.colors.info);
    console.log(str);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[this._config.level] >= this.logLevels[level];
  }

  private formatWithLabel(label: string, color: string, message: string, args: unknown[], valueColor?: string): string {
    const formatted = this._format(message, args, valueColor ?? color);
    return `${color}${label}${this._config.colors.text}: ${formatted}`;
  }

  private _format(message: string, args: unknown[], valueColor: string): string {
    return message.replace(/{(\d+)}/g, (match: string, index: string): string => {
      const value = args[+index];
      return typeof value !== "undefined"
        ? `${valueColor}${value}${this._config.colors.text}`
        : match;
    });
  }

  private log(message: string): void {
    const date = new Date();
    if (date.getDay() !== this._lastLogDate.getDay()) {
      console.log('\n\n' + `${this._config.colors.emphasis}${moment().format(this._config.logsDateFormat)}\n`);
    }

    console.log(`${this._config.colors.date}[${moment().format(this._config.logTimestampFormat)}] ${message}`);
    this._lastLogDate = date;
  }
}
