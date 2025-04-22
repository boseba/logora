import { Logora } from './services/logora';
import { LogoraConfig } from './models/logora.config';
import { ILogora } from './models/logora.interface';

export * from './enums';
export * from './models';
export * from './services';

/**
 * Factory function to create a new instance of the Logora logger.
 *
 * This function is the recommended way to create a logger instance from this library.
 * It allows overriding default configuration values such as log level or color mapping.
 *
 * @param config Optional partial configuration to override the default logger settings.
 * @returns An instance of Logora implementing the ILogora interface.
 */
export function createLogora(config?: Partial<LogoraConfig>): ILogora {
  return new Logora(config);
}
