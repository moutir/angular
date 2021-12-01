import { ContactPhoneInterface } from '../../../shared/interface/contact-phone.interface';

export interface SummaryByIdResponseInterface {
  address_line1: string;
  address_line2: string;
  address_line3: string;
  broker: {
    firstname: string;
    lastname: string;
    agency_name: string;
    emails: string[];
    phones: Array<ContactPhoneInterface>;
  };
  id: string;
  is_from_my_agency: boolean;
  location: string;
  name: string;
  properties: {
    num_of_properties: number;
    price: number;
    price_from: string;
    price_sold: number;
    sold: number;
    reserved: number;
    currency_id: string;
  };
  reference: string;
}
