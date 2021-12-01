import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PromotionEventArchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event archive';
  readonly type: string = PromotionEventArchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    promotionIds: string[];
  }) {

  }
}
