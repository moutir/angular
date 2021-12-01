import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../../../core-store/action-event.interface';

export class FisherEventStartOver implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event start over';
  readonly type: string = FisherEventStartOver.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
