import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class UploadEventCancelAll implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event cancel all';
  readonly type: string = UploadEventCancelAll.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
