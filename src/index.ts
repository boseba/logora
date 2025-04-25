import { LogoraConfig } from "./config";
import { LogoraCore } from "./core/logora";
import { ILogora } from "./models";

// Core exports for application usage
export * from "./enums";
export * from "./models";
export * from "./config";

/**
 * Creates a new logger instance with optional custom configuration.
 *
 * This function is the main entry point for using the Logora logger.
 * It returns a ready-to-use instance that conforms to the `ILogora` interface,
 * and dispatches logs to configured outputs.
 *
 * @param config Optional partial configuration for customizing behavior.
 * @returns A fully initialized and scoped logger instance.
 *
 * @example
 * ```ts
 * const logger = createLogger({ level: LogLevel.Debug });
 * logger.info("Server started on port {0}", port);
 * ```
 */
export function createLogger(config?: Partial<LogoraConfig>): ILogora {
  return new LogoraCore(config);
}
