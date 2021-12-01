import { OrderEnum } from '../../../shared/enum/order.enum';

export interface WebsiteListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  // Website filters
  main_url?: string;
  api_key?: string;
  api_key_public?: string;
}
