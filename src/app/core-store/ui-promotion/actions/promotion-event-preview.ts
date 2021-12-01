import { PositionInterface } from '../../../shared/interface/position.interface';
import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PromotionEventPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event preview';
  readonly type: string = PromotionEventPreview.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      promotionId: string;
      position: PositionInterface;
    },
  ) {

  }
}
