import { AreaUnitEnum } from '../../../shared/enum/area-unit.enum';
import { TypeEnum } from '../../../shared/enum/type.enum';

export interface PropertyListResponseInterface {
  data: Array<{
    bedrooms: string; // number of bedrooms
    category: string; // label
    subcategory: string; // label
    type: TypeEnum;
    create_datetime: string; // creation datetime
    create_contact_id: string; // contact ID that created property
    update_datetime: string; // update datetime
    update_contact_id: string; // contact ID that updated property
    details_visible: boolean; // unshared property has this value to false
    habitable: string; // [[formatted]] living area
    id: string; // unique ID
    important_notes: string; // important notes
    broker_notes: string; // broker notes
    address: string; // location
    land: string; // [[formatted]] land area
    location: string[]; // location array but only contains one value
    photo_thumb: string; // thumbnail photo URL
    photo_zoom: string; // zoomed photo URL
    price_frequency_id: string|null;
    price_charges: string; // [[formatted]] charges
    price_charges_included: boolean|null; // true = included, false = excluded, null = undefined
    ranking: string; // number of stars (but sent as a string)
    reference: string; // property reference
    rooms: string; // number of rooms
    status_label: string; // [[translated]] status label
    DT_RowClass: 'fromMyAgency'|'fromMyAgencyNoDetail'|'fromMyPartner'; // 'fromMyPartner' means MLS property
    area_unit: AreaUnitEnum;
    status_id: string; // status ID
    broker2: { id: string; initials: string; };
    owner2: Array<{ id: string; initials: string; }>;
    intermediate2: Array<{ id: string; initials: string; }>;
    mortgage: string;
    currency_id: string;
    currency_label: string;
    price: string;
    price_label: string; // [[formatted]] price

    // useless attributes
    informations: string;
    creation: string;
    broker_phones: {
      [id: number]: {
        name: string;
        phone: string[];
      }};
    intermediate: string[];
    intermediate_id: null;
    intermediate_phones: string[];
    owner_id: null;
    owner_phones: string[];
    promotion_id: null;
    DT_RowId: string;
    agency_name: string;
    brochure: string;
    check: string;
    index: number;
    title: string;
    warning: string;
    broker: string; // [[formatted]] broker initials
    owner: string[]; // owners initials
    contacts: string;
  }>;
  recordsTotal: string; // total number of records matching search query

  // useless attributes
  draw: string;
  myAgencyHasPartnership: boolean;
  recordsFiltered: string;
}
