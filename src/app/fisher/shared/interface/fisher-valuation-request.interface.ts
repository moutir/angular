export interface FisherValuationRequestInterface {
  recaptcha_token: string;
  deal_type: string;
  property: {
    type: string;
    subtype: string;
    building_year: number;
    living_area: number;
    land_area: number;
    condition: string;
    floor: number;
    rooms?: number;
    bathrooms?: number;
    location: {
      address: {
        street: string;
        house_number: string;
        post_code: string;
        city: string;
      };
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    motivation: string;
    country_code: string;
    city: string;
    address1: string;
    address2: string;
    post_code: string;
    language: string;
  };
}
