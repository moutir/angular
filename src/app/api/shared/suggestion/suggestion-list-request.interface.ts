import { OrderEnum } from '../../../shared/enum/order.enum';

export interface SuggestionListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  status_ids?: string[];
  tag_ids?: string[];
}
