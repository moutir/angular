import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { LeadModel } from '../../../shared/model/lead.model';

export class LeadEventSendEmail implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send email';
  readonly type: string = LeadEventSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    leads: LeadModel[];
  }) {

  }
}
