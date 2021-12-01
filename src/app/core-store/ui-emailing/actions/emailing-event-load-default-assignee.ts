import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class EmailingEventLoadDefaultAssignee implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load default assignee';
  readonly type: string = EmailingEventLoadDefaultAssignee.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
