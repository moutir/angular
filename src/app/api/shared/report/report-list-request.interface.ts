import { OrderEnum } from '../../../shared/enum/order.enum';

export interface ReportListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  property?: string[];
  broker?: string[];
  contact?: string[];
  type?: string;
  start_date?: string;
  end_date?: string;
  property_type?: string;
  scheduling?: string;
}
