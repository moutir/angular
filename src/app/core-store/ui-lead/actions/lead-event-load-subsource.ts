import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LeadEventLoadSubsource implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load subsource';
  readonly type: string = LeadEventLoadSubsource.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    sourceId: string;
  }) {

  }
}
