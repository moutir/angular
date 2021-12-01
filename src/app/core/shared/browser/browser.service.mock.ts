import { BrowserService } from './browser.service';
import { TrackerServiceMock } from '../tracker/tracker-service.mock';

export function BrowserServiceMock(): BrowserService {

  const mock = jasmine.createSpyObj('BrowserService', [
    'setWindow',
    'getWindow',
    'getRealforceConfig',
    'scrollTo',
    'querySelector',
    'getScrollY',
    'getWindowHeight',
    'getBodyHeight',
    'reload',
    'blank',
  ]);

  const dataLayerMock = jasmine.createSpyObj('dataLayer', [
    'push',
  ]);

  mock.getWindow.and.returnValue({
    realforce: {
      config: {},
    },
    dataLayer: dataLayerMock,
    rfTrackerService: TrackerServiceMock(),
  });

  mock.getRealforceConfig.and.returnValue({
    mailbox: {},
  });

  mock.querySelector.and.returnValue(document.createElement('div'));

  return mock;
}
