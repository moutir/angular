import { TrackerInterface } from '../../../shared/interface/tracker.interface';

export function TrackerServiceMock(): TrackerInterface {

  return jasmine.createSpyObj('TrackerInterface', [
    'track',
    'trackUser',
    'trackString',
    'trackLabelValue',
    'trackStringPair',
    'trackStringList',
    'trackSort',
    'trackStringBrochure',
    'setUser',
  ]);
}
