import { OrderEnum } from '../../../shared/enum/order.enum';
import { MatchingFiltersDecoratorInterface } from './matching-filters-decorator.interface';

export interface MatchingListRequestInterface extends MatchingFiltersDecoratorInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
}
