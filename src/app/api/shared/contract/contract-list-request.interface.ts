import { OrderEnum } from '../../../shared/enum/order.enum';

export interface ContractListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  // Contract related filters
  type?: string;
}
