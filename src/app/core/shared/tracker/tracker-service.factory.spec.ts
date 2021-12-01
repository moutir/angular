import { TrackerServiceFactory } from './tracker-service.factory';
import { BrowserServiceMock } from '../browser/browser.service.mock';
import { TrackerDecorator } from './gtm/tracker-decorator';
import { TrackerInterface } from '../../../shared/interface/tracker.interface';
import { BrowserService } from '../browser/browser.service';

describe('TrackerServiceFactory()', () => {

  let trackerService: TrackerInterface;
  let browserServiceMock: BrowserService;

  beforeEach(() => {

    browserServiceMock = BrowserServiceMock();
    trackerService = TrackerServiceFactory(browserServiceMock);
  });

  it('should return an instance of GTM TrackerDecorator', () => {

    expect(trackerService instanceof TrackerDecorator).toBe(true);
  });

  it('should expose TrackerService to legacy javascript', () => {

    expect(browserServiceMock.getWindow().rfTrackerService).toBe(trackerService);
  });
});
