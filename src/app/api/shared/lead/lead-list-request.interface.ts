import { OrderEnum } from '../../../shared/enum/order.enum';

export interface LeadListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order
  lead_type: string;
  lead_from: string;
  lead_to: string;
  contact: string;
  property: string;
  managed_by: string;
  main_lead_source: string;
  sub_lead_source: string;
  lead_status: string[];
}
