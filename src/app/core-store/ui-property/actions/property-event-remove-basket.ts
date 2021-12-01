import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventRemoveBasket implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove basket';
  readonly type: string = PropertyEventRemoveBasket.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
