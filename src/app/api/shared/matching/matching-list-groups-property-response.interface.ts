import { LanguageEnum } from '../../../shared/enum/language.enum';

export interface MatchingListGroupsPropertyResponseInterface {
  bathrooms: string;
  bedrooms: string;
  broker_firstname: string;
  broker_id: string;
  broker_lastname: string;
  habitable: string;
  index: number;
  location: {
    label: string;
    city: string[];
    street: string;
    zipcode: string;
  };
  matches: Array<{
    broker_firstname: string;
    broker_id: string;
    broker_lastname: string;
    contact_firstname: string|null;
    contact_id: string;
    contact_lastname: string|null;
    contact_name: string;
    contact_ranking: string;
    contact_search: {
      id: string;
      title: string;
      status_id: string;
      manager_id: string;
      manager_firstname: string;
      manager_lastname: string;
      note: string|null;
    }
    contact_search_id: string;
    matching_score: {
      area: number;
      bedroom: number;
      land: number;
      price: number;
      room: number;
      total: number;
    };
    contact_vip: 0
    email_exists: 1
    id: string;
    language_id: LanguageEnum|null;

    // Useless sub-attributes
    firstname: string;
    lastname: string;
  }>;
  photo_thumb: string;
  price: string;
  promotion_id: string;
  property_id: string;
  ranking: string;
  reference: string;
  rooms: string;
  subcategory: string;
  transaction_type_id: string;
  weighted: string;

  // Useless attribute
  photo: string;
}
