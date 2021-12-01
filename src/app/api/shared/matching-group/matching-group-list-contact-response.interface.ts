import { LanguageEnum } from '../../../shared/enum/language.enum';

export interface MatchingGroupListContactResponseInterface {
  broker_firstname: string;
  broker_id: string;
  broker_lastname: string;
  contact_firstname: string|null;
  contact_id: string;
  contact_lastname: string|null;
  contact_name: string;
  contact_ranking: string;
  contact_search: {
    label: string;
    note: string|null;
  };
  contact_search_id: string;
  contact_vip: number;
  email_exists: number;
  index: number;
  language_id: LanguageEnum|null;
  matches: Array<{
    contact_id: string;
    id: string;
    photo: string;
    promotion_id: string;
    property_agency_id: string;
    property_id: string;
    reference: string;
    transaction_type_id: string;
    property: {
      id: string;
      promotion_id: string;
      transaction_type_id: string;
      reference: string;
      rooms: string;
      bedrooms: string;
      bathrooms: string;
      habitable: string;
      weighted: string;
      ranking: string;
      location: {
        label: string;
        city: string[];
        street: string;
        zipcode: string;
      };
      broker_id: string;
      broker_firstname: string;
      broker_lastname: string;
      price: string;
      photo_thumb: string;
      subcategory: string;
    }
  }>;
}
