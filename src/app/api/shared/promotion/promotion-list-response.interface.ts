export interface PromotionListResponseInterface {
  data: Array<{
    id: string;
    name: string;
    reference: string;
    DT_RowClass: string;
    agency_id: string;
    broker_notes: string;
    date_end_construction_work2: string;
    date_start_construction_work2: string;
    details_visible: boolean;
    location: string;
    number_of_properties: number;
    number_of_properties_reserved: number;
    number_of_properties_sold: number;
    photo: {
      photo_thumb: string;
      photo_zoom: string;
    };
    price: string;
    price_sold: string;
    project_manager: {
      name: string;
      email: string;
      phones: string[];
    },
    project_manager_id: string;
  }>;
  draw: string;
  recordsFiltered: string;
  recordsTotal: string; // total number of records matching search query
}
