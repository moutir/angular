import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class UploadEventToggleStatusBar implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle status bar';
  readonly type: string = UploadEventToggleStatusBar.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
