import { OrderEnum } from '../../../shared/enum/order.enum';

export interface MatchingListGroupsRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
  contact_id: string;
  property_id: string;
  property_broker_id: string;
  contact_broker_id: string;
  contact_search_broker_id: string;
  promotion_id: string;
  named_filter: string; // matching group type
}
