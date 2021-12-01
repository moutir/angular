import { OrderEnum } from '../../../shared/enum/order.enum';

export interface ContactListBetaPerformanceRequestInterface {
  start: number; // limit from
  length: number; // limit count
  sort_id: string; // sort column
  sort_order: OrderEnum; // sort order

  circle: string;
  is_archive?: string;
  keyword?: string;
  contact_type_ids?: string[];
  manager_contact_ids?: string[];
  property_ids?: string[];
  language_id?: string;
  is_direct_client?: string;
  visibility_id?: string;
  origin_ids?: string[];
  is_vip?: string;
  last_contact_id?: string;
  rankings?: string[];
  custom_attribute_value_ids?: string[];
  contact_state_ids?: string[];
  search_state_id?: string;
  contact_id?: string;
  search_manager_contact_ids?: string[];
  location_path?: string;
  transaction_type_id?: string;
  main_category_ids?: string[];
  bedroom_min?: string;
  bedroom_max?: string;
  room_min?: string;
  room_max?: string;
  price_min?: string;
  price_max?: string;
  area_min?: string;
  area_max?: string;
  position_ids?: string[];
  view_ids?: string[];
  is_new_property?: string;
}
