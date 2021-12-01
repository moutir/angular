export interface ContactListResponseInterface {
  data: Array<{
    id: string; // unique ID
    firstname: string;
    lastname: string;
    name: string;
    language_id: string;
    agency_id: string;
    main_email: string;
    emails: string[];
    create_datetime: string;
    DT_RowId: string;
    DT_RowClass: 'fromMyAgency'|'fromMyPartner';
    check: string;
    can_update_rating: boolean;
    editable: boolean;
    contact_in_charge_broker: string;
    contact_in_charge_phones_broker: {
      [id: number]: { name: string; phone: string[]; };
    };
    contact_in_charge_rental: string;
    contact_in_charge_phones_rental: {
      [id: number]: { name: string; phone: string[]; };
    };
    contact_in_charge_sale: string;
    contact_in_charge_phones_sale: {
      [id: number]: { name: string; phone: string[]; };
    };
    contact_in_charge_intermediate: string;
    contact_in_charge_phones_intermediate: {
      [id: number]: { name: string; phone: string[]; };
    };
    index: number;
    informations: boolean;
    is_anonymous: boolean;
    is_owner: boolean;
    last_contact_datetime: string;
    match: boolean;
    phone: string;
    ranking: string;
    search_count: number;
  }>;
  recordsTotal: string; // total number of records matching search query

  // useless attributes
  draw: string;
  myAgencyHasPartnership: boolean;
  recordsFiltered: string;
  last_contact_time: string;
}
