import { ContactPhoneInterface } from '../../../shared/interface/contact-phone.interface';

export interface SummaryByIdResponseInterface {
  bedrooms: string;
  broker: {
    firstname: string;
    lastname: string;
    agency_name: string;
    emails: string[];
    phones: Array<ContactPhoneInterface>;
  };
  habitable: string;
  land: string;
  location: string;
  main_category: string;
  price: string;
  rooms: string;
  zip: string;
  reference: string;
}
