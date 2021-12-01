import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MlsEventListAgencies implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event list agencies';
  readonly type: string = MlsEventListAgencies.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
