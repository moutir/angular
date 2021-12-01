export interface ReportListResponseInterface {
  data: Array<{
    id: string;
    DT_RowClass: string;
    brokers: Array<{
      id: string;
      name: string;
    }>;
    contact_id: string;
    contact_info: {
      email: string;
      photo_url: string;
      ranking: string;
    };
    email: string;
    photo_url: string;
    email_exists: boolean;
    client_broker_id: string;
    main_contact_id: string;
    name: {
      id: string;
      name: string;
    };
    number_of_propositions: number|string;
    number_of_listings_sent: number|string;
    number_of_visits_done: number|string;
    number_of_visits_planned: number|number;
    property_address: string;
    property_broker_id: string;
    property_id: string;
    property_info: {
      canton: string;
      city: string;
      photo_url: string;
      price: string;
      bathrooms: string;
      bedrooms: string;
      property_broker: {
        id: string;
        full_name: string;
      }
      habitable: string;
      land: string;
      ranking: string;
      rooms: string;
      weighted: string;
      subcategory: string;
    };
    property_reference: string;
    promotion_address: string;
    promotion_id: string;
    promotion_name: string;
    promotion: {
      bathrooms_from: string;
      bathrooms_to: string;
      bedrooms_from: string;
      bedrooms_to: string;
      currency: string;
      habitable_from: string;
      habitable_to: string;
      number_of_properties: number;
      number_of_properties_reserved: number;
      number_of_properties_sold: number;
      price_from: string;
      price_to: string;
      rooms_from: string;
      rooms_to: string;
      weighted_from: string;
      weighted_to: string;
      promotion_broker: {
        id: string;
        full_name: string;
      };
      photo_url: string;
    }
    scheduler: {
      attribute: string;
      broker: string;
      clones: string;
      communications: string;
      date_range: string;
      enabled: boolean;
      start: string;
      start_datetime: string;
      end: string;
      end_datetime: string;
      frequency: string;
      hide_intermediary_task: string;
      informations: string;
      lang: string;
      leads: string;
      marketing_expenses: string;
      next_visits: string;
      offers: string;
      past_visits: string;
      price: string;
      report_sender_contact_id: string;
      sending: string;
      summary: string;
      time: string;
    };
  }>;
  draw: number;
  recordsFiltered: string;
  recordsTotal: string; // total number of records matching search query
  communicationLanguages: string[];
  schedulerLabel: string;
  schedulerTitle: string;
  brochureTypes: {
    report_landlord: string;
  };
}
