import { PromotionFiltersDecoratorInterface } from './promotion-filters-decorator.interface';

export interface PromotionIdsRequestInterface extends PromotionFiltersDecoratorInterface {
  format: 'numeric';
}
