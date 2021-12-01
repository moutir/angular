import { OrderEnum } from '../../../shared/enum/order.enum';

export interface ReportingListRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  // property related filters
  property?: string[];
  contact?: string;
  direct_transaction?: string;
  main_category?: string[];
  price?: string[];
  bedrooms?: string[];
  rooms?: string[];
  living_area?: string[];
  land_area?: string[];
  position?: string[];
  view?: string[];
  publication_status?: string;
  publication?: string[];
  visibility?: string;
  broker?: string[];
  status?: string[];
  is_promotion?: string;
  agency_id?: string;
  sell_foreigner?: string;
  promotion?: string[];
  ranking?: string[];

  // report filters
  report_data_from: string;
  report_data_to: string;
  report_status: string[];
}
