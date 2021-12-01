import { PositionInterface } from '../../../shared/interface/position.interface';
import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventPreview implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event preview';
  readonly type: string = ContactEventPreview.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      contactId: string;
      position: PositionInterface;
      hash: string;
    },
  ) {

  }
}
