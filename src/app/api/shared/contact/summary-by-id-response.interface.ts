import { ContactBrokerInterface } from '../../../shared/interface/contact-broker.interface';
import { ContactPhoneInterface } from '../../../shared/interface/contact-phone.interface';

export interface SummaryByIdResponseInterface {
  id: string;
  brokers: {
    main?: {
      contact: ContactBrokerInterface;
      phones: ContactPhoneInterface[];
    };
    rental?: {
      contact: ContactBrokerInterface;
      phones: ContactPhoneInterface[];
    };
    sales?: {
      contact: ContactBrokerInterface;
      phones: ContactPhoneInterface[];
    };
  };
  agency: string;
  company: string;
  email?: string;
  fullname: string;
  firstname: string;
  lastname: string;
  notes: string;
  phones?: ContactPhoneInterface[]; // phone numbers
  searches: Array<{
    id: string;
    title: string;
    status_id: string;
    manager_id: string;
    manager_firstname: string;
    manager_lastname: string;
    note: string;
  }>;
  types: string[];
  creation?: string;
  ranking?: number;
}
