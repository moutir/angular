import { LanguageEnum } from '../../../shared/enum/language.enum';

export interface MatchingGroupListPromotionResponseInterface {
  broker_firstname: string;
  broker_id: string;
  broker_lastname: string;
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
      label: string;
      note: string|null;
    }
    contact_search_id: string;
    contact_vip: 0
    email_exists: 1
    firstname: string;
    id: string;
    language_id: LanguageEnum|null;
    lastname: string;
    duplicate_match_id: string[];
  }>;
  photo_thumb: string;
  promotion_id: string;
  reference: string;
  summary: {
    bathrooms_from: string|null;
    bathrooms_to: string|null;
    bedrooms_from: string|null;
    bedrooms_to: string|null;
    currency: string;
    currency_id: string;
    habitable_from: string|null;
    habitable_to: string|null;
    num_of_properties: number;
    price: number;
    price_from: string|null;
    price_sold: number;
    price_to: string|null;
    reserved: number;
    rooms_from: string|null;
    rooms_to: string|null;
    sold: number;
    weighted_from: string|null;
    weighted_to: string|null;
  };

  // Useless attribute
  photo: string;
}
