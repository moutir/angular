import { BrowserService } from './browser.service';
import { WindowInterface } from '../../../shared/interface/window.interface';

export const BrowserServiceFactory = (): BrowserService => {

  const browserService = new BrowserService();

  browserService.setWindow(<WindowInterface>window);

  return browserService;
};
