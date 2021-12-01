import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MlsEventLoadAgency implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load agency';
  readonly type: string = MlsEventLoadAgency.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }
}
