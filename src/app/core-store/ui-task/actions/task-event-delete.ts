import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class TaskEventDelete implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event delete';
  readonly type: string = TaskEventDelete.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    taskId: string;
  }) {

  }
}
