import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventAddBasket implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event add basket';
  readonly type: string = PropertyEventAddBasket.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
