import { FEATURE_NAME, UiPromotionStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PromotionBrochureMenuInterface } from '../../../shared/interface/promotion-brochure-menu.interface';

export class PromotionUpdateBrochureMenu implements ActionUpdateInterface<UiPromotionStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update brochure menu';
  readonly type: string = PromotionUpdateBrochureMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    brochureMenu: PromotionBrochureMenuInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPromotionStateInterface): UiPromotionStateInterface {

    return {
      ...state,
      brochureMenu: {
        ...state.brochureMenu,
        ...this.payload.brochureMenu,
      },
    };
  }
}
