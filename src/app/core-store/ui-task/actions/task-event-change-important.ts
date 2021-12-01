import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class TaskEventChangeImportant implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change important';
  readonly type: string = TaskEventChangeImportant.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    taskId: string;
    isImportant: boolean;
  }) {

  }
}
