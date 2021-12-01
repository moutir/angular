import { BrowserService } from '../browser/browser.service';
import { TrackerDecorator } from './gtm/tracker-decorator';
import { TrackerService } from './tracker.service';
import { TrackerInterface } from '../../../shared/interface/tracker.interface';

export const TrackerServiceFactory = (browserService: BrowserService): TrackerInterface => {

  return new TrackerDecorator(
    new TrackerService(),
    browserService.getWindow().dataLayer,
  );
};
