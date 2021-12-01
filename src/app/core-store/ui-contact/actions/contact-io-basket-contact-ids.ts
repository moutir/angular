import { FEATURE_NAME, UiContactStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class ContactIoBasketContactIds implements ActionUpdateInterface<UiContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': IO basket contact IDs';
  readonly type: string = ContactIoBasketContactIds.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    in?: string[],
    out?: string[],
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiContactStateInterface): UiContactStateInterface {

    const newState = {
      ...state,
      basketContactIds: state.basketContactIds.slice(0),
    };

    // Add contact IDs to basket
    if (this.payload.in) {

      this.payload.in
        .filter(id => newState.basketContactIds.indexOf(id) === -1)
        .forEach(id => newState.basketContactIds.push(id));
    }

    // Remove contact IDs from basket
    if (this.payload.out) {

      newState.basketContactIds = newState.basketContactIds.filter(id => this.payload.out.indexOf(id) === -1);
    }

    return newState;
  }
}
