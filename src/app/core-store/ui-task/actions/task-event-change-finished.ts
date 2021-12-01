import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class TaskEventChangeFinished implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change finished';
  readonly type: string = TaskEventChangeFinished.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    taskId: string;
    isFinished: boolean;
  }) {

  }
}
