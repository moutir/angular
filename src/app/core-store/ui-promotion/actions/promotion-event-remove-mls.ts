import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PromotionEventRemoveMls implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove MLS';
  readonly type: string = PromotionEventRemoveMls.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    promotionIds: string[];
  }) {

  }
}
