import { PositionInterface } from '../../../shared/interface/position.interface';
import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class RestrictionEventPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event preview';
  readonly type: string = RestrictionEventPreview.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      restrictionId: string;
      position: PositionInterface;
    },
  ) {

  }
}
