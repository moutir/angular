import { OrderEnum } from '../../../shared/enum/order.enum';

export interface AccountListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  agency_id?: string;
  account_type_id?: string;
  contact_id?: string;
  login?: string;
  is_active?: string;
}
