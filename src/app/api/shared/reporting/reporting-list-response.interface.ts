import { AreaUnitEnum } from '../../../shared/enum/area-unit.enum';

export interface ReportingListResponseInterface {
  data: Array<{
    id: string;
    recipients: Array<{
      id: string;
      initials: string;
      firstname: string;
      lastname: string;
      fullname: string;
    }>;
    report_created_at: string;
    from_date: string;
    to_date: string;
    frequency: string;
    preview_url: string;
    sender_contact_id: string;
    owner_broker_id: string;
    process_status: string;
    process_datetime: string;
    process_user: {
      id: string;
      initials: string;
      firstname: string;
      lastname: string;
      fullname: string;
    };
    public_link_id: string;
    property: {
      bedrooms: string; // number of bedrooms
      bathrooms: string; // number of bathrooms
      category: string; // label
      subcategory: string; // label
      habitable: string; // [[formatted]] living area
      id: string; // unique ID
      address: string; // location
      land: string; // [[formatted]] land area
      location: string[]; // location array but only contains one value
      photo_thumb: string; // thumbnail photo URL
      photo_zoom: string; // zoomed photo URL
      price: string; // [[formatted]] priced
      ranking: string; // number of stars (but sent as a string)
      reference: string; // property reference
      rooms: string; // number of rooms
      status_label: string; // [[translated]] status label
      area_unit: AreaUnitEnum;
      status_id: string; // status ID
      broker: {
        id: string;
        initials: string;
        firstname: string;
        lastname: string;
        fullname: string;
      };
      agency_name: string;
      title: string;
    };
  }>;
  draw: number;
  recordsFiltered: string;
  recordsTotal: string; // total number of records matching search query
}
