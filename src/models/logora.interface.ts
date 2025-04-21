export interface ILogora {
  info(message: string, ...args: unknown[]): void;
  warning(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
  highlight(message: string, ...args: unknown[]): void;
  title(title: string): void;
  empty(count?: number): void;
  clear(): void;
  print(message: string, ...args: unknown[]): void;
}