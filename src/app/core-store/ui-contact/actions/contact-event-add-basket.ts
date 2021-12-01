import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventAddBasket implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event add basket';
  readonly type: string = ContactEventAddBasket.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
  }) {

  }
}
