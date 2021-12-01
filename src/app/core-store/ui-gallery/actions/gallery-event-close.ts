import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class GalleryEventClose implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event close';
  readonly type: string = GalleryEventClose.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
