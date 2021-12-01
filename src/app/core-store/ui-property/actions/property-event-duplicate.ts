import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventDuplicate implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event duplicate';
  readonly type: string = PropertyEventDuplicate.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
