import { ContactModel } from '../model/contact.model';

export interface LeadContactValidationInterface {
  contact: ContactModel;
  matchingContacts: ContactModel[];
}
