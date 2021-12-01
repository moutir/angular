import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PropertyIoBasketPropertyIds implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': IO basket property IDs';
  readonly type: string = PropertyIoBasketPropertyIds.TYPE;

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
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    const newState = {
      ...state,
      basketPropertyIds: state.basketPropertyIds.slice(0),
    };

    // Add property IDs to basket
    if (this.payload.in) {

      this.payload.in
        .filter(id => newState.basketPropertyIds.indexOf(id) === -1)
        .forEach(id => newState.basketPropertyIds.push(id));
    }

    // Remove property IDs from basket
    if (this.payload.out) {

      newState.basketPropertyIds = newState.basketPropertyIds.filter(id => this.payload.out.indexOf(id) === -1);
    }

    return newState;
  }
}
