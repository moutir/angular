import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventRemoveMls implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove MLS';
  readonly type: string = PropertyEventRemoveMls.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
