import { LeadValidationContactInterface } from './lead-validation-contact.interface';

export interface LeadValidationLoadResponseInterface {
  contact: LeadValidationContactInterface;
  found_contacts: LeadValidationContactInterface[];
  success: boolean;
}
