import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyMortgageInterface } from '../../../shared/interface/property-mortgage.interface';

export class PropertyUpdateMortgage implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update mortgage';
  readonly type: string = PropertyUpdateMortgage.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    mortgage: PropertyMortgageInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      mortgage: {
        ...state.mortgage,
        ...this.payload.mortgage,
      },
    };
  }
}
