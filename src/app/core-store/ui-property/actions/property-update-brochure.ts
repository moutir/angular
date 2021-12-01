import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyBrochureInterface } from '../../../shared/interface/property-brochure.interface';

export class PropertyUpdateBrochure implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update brochure';
  readonly type: string = PropertyUpdateBrochure.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    brochure: PropertyBrochureInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      brochure: {
        ...this.payload.brochure,
      },
    };
  }
}
