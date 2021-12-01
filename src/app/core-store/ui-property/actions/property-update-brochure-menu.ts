import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyBrochureMenuInterface } from '../../../shared/interface/property-brochure-menu.interface';

export class PropertyUpdateBrochureMenu implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update brochure menu';
  readonly type: string = PropertyUpdateBrochureMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    brochureMenu: PropertyBrochureMenuInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      brochureMenu: {
        ...state.brochureMenu,
        ...this.payload.brochureMenu,
      },
    };
  }
}
