import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyValuationInterface } from '../../../shared/interface/property-valuation.interface';

export class PropertyUpdateValuation implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update valuation';
  readonly type: string = PropertyUpdateValuation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    valuation: PropertyValuationInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      valuation: {
        ...state.valuation,
        ...this.payload.valuation,
      },
    };
  }
}
