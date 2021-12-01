import { BrowserService } from '../browser/browser.service';
import { LocalStorageService } from './local-storage.service';

export const LocalStorageServiceFactory = (browserService: BrowserService) => {

  return new LocalStorageService(browserService.getWindow().localStorage);
};
