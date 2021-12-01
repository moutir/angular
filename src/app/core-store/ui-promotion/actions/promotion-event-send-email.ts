import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PromotionEventSendEmail implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send email';
  readonly type: string = PromotionEventSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    promotionIds: string[];
  }) {

  }
}
