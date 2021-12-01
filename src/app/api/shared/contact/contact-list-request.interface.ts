import { OrderEnum } from '../../../shared/enum/order.enum';
import { ContactFiltersDecoratorInterface } from './contact-filters-decorator.interface';

export interface ContactListRequestInterface extends ContactFiltersDecoratorInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
}
