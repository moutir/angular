import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LayoutEventOperation implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event operation';
  readonly type: string = LayoutEventOperation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    operation: string;
  }) {

  }
}
