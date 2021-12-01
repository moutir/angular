import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PromotionEventUnarchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event unarchive';
  readonly type: string = PromotionEventUnarchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    promotionIds: string[];
  }) {

  }
}
