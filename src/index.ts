import { Logora } from './services/logora';
import { LogoraConfig } from './models/logora.config';
import { ILogora } from './models/logora.interface';

export * from './enums';
export * from './models';
export * from './services';

export function createLogora(config?: Partial<LogoraConfig>): ILogora {
  return new Logora(config);
}
