import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';
import { EntityDocumentsOptionsInterface } from './entity-documents-options.interface';

export interface EmailingOptionsInterface {

  // List of brokers
  brokerId: OptionInterface[];

  // List of email templates
  emailTemplate: OptionInterface[];

  // List of email contents per source
  emailContent: OptionGroupInterface[];

  // List of email brochure type IDs
  emailBrochureTypeId: OptionInterface[];

  // List of email brochure privacy IDs
  emailBrochurePrivacyId: OptionInterface[];

  // List of languages
  language: OptionInterface[];

  // List of entity documents
  documents: EntityDocumentsOptionsInterface;

  // List of accounts which allow to send email on their behalf
  sender: OptionGroupInterface[];
}
