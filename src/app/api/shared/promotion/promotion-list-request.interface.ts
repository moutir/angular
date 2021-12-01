import { OrderEnum } from '../../../shared/enum/order.enum';
import { PromotionFiltersDecoratorInterface } from './promotion-filters-decorator.interface';

export interface PromotionListRequestInterface extends PromotionFiltersDecoratorInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
}
