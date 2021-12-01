import { PositionInterface } from '../../../shared/interface/position.interface';
import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event preview';
  readonly type: string = PropertyEventPreview.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      propertyId: string;
      position: PositionInterface;
    },
  ) {

  }
}
