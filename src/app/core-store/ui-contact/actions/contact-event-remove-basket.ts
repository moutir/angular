import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventRemoveBasket implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove basket';
  readonly type: string = ContactEventRemoveBasket.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
  }) {

  }
}
