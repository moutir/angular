import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventUnarchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event unarchive';
  readonly type: string = PropertyEventUnarchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
