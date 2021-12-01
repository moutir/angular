import { OrderEnum } from '../../../shared/enum/order.enum';
import { PropertyFiltersDecoratorInterface } from './property-filters-decorator.interface';

export interface PropertyListRequestInterface extends PropertyFiltersDecoratorInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
}
