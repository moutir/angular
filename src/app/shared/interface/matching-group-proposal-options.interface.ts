import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';
import { ContactModel } from '../model/contact.model';
import { MatchingGroupLanguageOptionInterface } from './matching-group-language-option.interface';

export interface MatchingGroupProposalOptionsInterface {

  // List of email templates
  emailTemplate: OptionInterface[];

  // List of email contents per source
  emailContent: OptionGroupInterface[];

  // List of email brochure types
  emailBrochureTypeId: OptionInterface[];

  // List of email brochure privacy rules
  emailBrochurePrivacyId: OptionInterface[];

  // List of languages available for the selected email content
  emailContentLanguages: OptionInterface[]|null;

  // List of contacts for whom their language is not set for the selected email content
  emailContentContacts: ContactModel[]|null;

  // List of contact languages
  emailContentContactLanguages: MatchingGroupLanguageOptionInterface[];

  // List of accounts which allow to send email on their behalf
  sender: OptionGroupInterface[];
}
