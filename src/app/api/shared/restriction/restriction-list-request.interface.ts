import { EntityEnum } from '../../../shared/enum/entity.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';

export interface RestrictionListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  name?: string;
  module?: EntityEnum;
}
