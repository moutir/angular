import { PromotionBrochureMenuInterface } from '../../shared/interface/promotion-brochure-menu.interface';

export const FEATURE_NAME = 'ui-promotion';

export interface UiPromotionStateInterface {

  // Brochure menu state
  brochureMenu: PromotionBrochureMenuInterface;

  // Promotion preview by ID
  previewPromotionId: string;
}

export const initialState: UiPromotionStateInterface = {
  brochureMenu: {
    promotionId: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  previewPromotionId: '',
};
