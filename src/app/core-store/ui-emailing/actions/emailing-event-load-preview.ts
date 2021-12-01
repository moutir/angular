import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class EmailingEventLoadPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load preview';
  readonly type: string = EmailingEventLoadPreview.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
