import { BrowserService } from '../browser/browser.service';
import { SessionStorageService } from './session-storage.service';

export const SessionStorageServiceFactory = (browserService: BrowserService) => {

  return new SessionStorageService(browserService.getWindow().sessionStorage);
};
