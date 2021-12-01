import { FEATURE_NAME } from '../../data-runtime/state';
import { ActionEventInterface } from '../../action-event.interface';

export class RuntimeEventToggleBeta implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle beta';
  readonly type: string = RuntimeEventToggleBeta.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
