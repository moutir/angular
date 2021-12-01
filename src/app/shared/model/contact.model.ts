import { ModelAbstract } from '../class/model.abstract';
import { LanguageEnum } from '../enum/language.enum';
import { ContactTypeEnum } from '../enum/contact-type.enum';
import { ContactPhoneModel } from './contact-phone.model';
import { ContactEmailModel } from './contact-email.model';
import { ContactAddressModel } from './contact-address.model';
import { AgencyModel } from './agency.model';
import { DocumentModel } from './document.model';
import { EntityEnum } from '../enum/entity.enum';
import { ContactSocialModel } from './contact-social.model';
import { SearchModel } from './search.model';

export class ContactModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'documents',
    'mobiles',
    'landlines',
    'faxes',
    'addresses',
    'emails',
    'socials',
    'searches',
    'createContact',
    'updateContact',
    'mainContact',
    'saleContact',
    'rentalContact',
    'intermediateContact',
  ];

  /**
   * Contact ID
   */
  id: string = '';

  /**
   * Reference
   */
  reference: string = '';

  /**
   * Which entity does this contact represent ? Expected values would be: contact|user
   */
  entity: EntityEnum = EntityEnum.contact;

  /**
   * Agency
   */
  agency: AgencyModel = new AgencyModel();

  /**
   * Main manager ID
   * @deprecated For legacy API support only
   */
  mainContactId: string = '';

  /**
   * Sale manager ID
   * @deprecated For legacy API support only
   */
  saleContactId: string = '';

  /**
   * Rental manager ID
   * @deprecated For legacy API support only
   */
  rentalContactId: string = '';

  /**
   * Main manager
   */
  mainContact: ContactModel|null = null;

  /**
   * Sale manager
   */
  saleContact: ContactModel|null = null;

  /**
   * Rental manager
   */
  rentalContact: ContactModel|null = null;

  /**
   * Documents
   */
  documents: DocumentModel[] = [];

  /**
   * Initials
   */
  initials: string = '';

  /**
   * First name
   */
  firstName: string = '';

  /**
   * First name (secondary)
   */
  firstName2: string = '';

  /**
   * Last name
   */
  lastName: string = '';

  /**
   * Last name (secondary)
   */
  lastName2: string = '';

  /**
   * Full name
   */
  fullName: string = '';

  /**
   * Title
   */
  titleId: string = '';

  /**
   * Greeting
   */
  greetingId: string = '';

   /**
   * Photo ID
   */
  photoId: string = '';

  /**
   * Photo URL
   */
  photoURL: string = '';

  /**
   * Company name
   */
  companyName: string = '';

  /**
   * Company logo URL
   */
  companyLogoUrl: string = '';

  /**
   * Contact link
   */
  link: string = '';

  /**
   * Ranking
   */
  ranking: number = 0;

  /**
   * Type ID
   */
  type: ContactTypeEnum|null = null;

  /**
   * Language ID
   */
  languageId: LanguageEnum = LanguageEnum.en;

  /**
   * Nationality ID
   */
  nationalityId: string = '';

  /**
   * Country ID
   */
  countryId: string = '';

  /**
   * Marital status ID
   */
  maritalStatusId: string = '';

  /**
   * Children ID
   */
  childrenId: string = '';

  /**
   * Zip code
   */
  zipCode: string = '';

  /**
   * City
   */
  city: string = '';

  /**
   * Profession
   */
  profession: string = '';

  /**
   * Bank reference
   */
  bankReference: string = '';

  /**
   * Internal notes
   */
  notes: string = '';

  /**
   * Contact types
   */
  contactTypeIds: ContactTypeEnum[] = [];

  /**
   * Intermediate contact
   */
  intermediateContact: ContactModel|null = null;

  /**
   * Mobile numbers
   */
  mobiles: ContactPhoneModel[] = [];

  /**
   * Landline numbers
   */
  landlines: ContactPhoneModel[] = [];

  /**
   * Fax numbers
   */
  faxes: ContactPhoneModel[] = [];

  /**
   * Emails
   */
  emails: ContactEmailModel[] = [];

  /**
   * Addresses
   */
  addresses: ContactAddressModel[] = [];

  /**
   * Socials
   */
  socials: ContactSocialModel[] = [];

  /**
   * Searches
   */
  searches: SearchModel[] = [];

  /**
   * Date of birth
   */
  birthDate: Date|null = null;

  /**
   * Created contact
   */
  createContact: ContactModel|null = null;

  /**
   * Creation date
   */
  createDate: Date|null = null;

  /**
   * Updated contact
   */
  updateContact: ContactModel|null = null;

  /**
   * Updated date
   */
  updateDate: Date|null = null;

  /**
   * Last contact date
   */
  lastContactDate: Date|null = null;

  /**
   * If this contact was matched, what was it matched by ? (email, phone, name...)
   */
  matchBy: string = '';

  /**
   * Is the contact blacklisted ?
   */
  isBlacklisted: boolean = false;

  /**
   * Is the contact editable ?
   */
  isEditable: boolean = false;

  /**
   * Is the contact a VIP ?
   */
  isVip: boolean = false;

  /**
   * Is the email valid ?
   */
  isValidEmail: boolean = false;

  /**
   * Is the contact archived ?
   */
  isArchived: boolean = false;

  /**
   * Is direct client ?
   */
  isDirectClient: boolean = true;

  /**
   * Custom attributes IDs
   */
  customAttributeIds: string[] = [];

  /**
   * Visibility ID
   */
  visibilityId: string = '';

  /**
   * Pipeline stage ID
   */
  pipelineStageId: string = '';

  /**
   * Origin ID
   */
  originId: string = '';

  /**
   * Is hidden on MLS
   */
  isHiddenOnMls: boolean = false;

  /**
   * Job description
   */
  jobDescription: string = '';

  /**
   * Is the contact confidential ?
   */
  isConfidential: boolean = false;

  /**
   * TODO[later] CRAP ALERT! Remove once UI/UX has split contact/account
   *
   * In legacy, account belongs to contact.
   * In Symfony, contact belongs to account.
   * In Angular, we end up with a circular dependency, thank you backend :)
   *
   * To solve this issue, while the account form is located in the contact form,
   * we "flatify" and duplicate the account attributes directly into the contact.
   *
   * This means we keep the long term data relationship, the Symfony one, contact belongs to account.
   */
  accountId: string = '';
  accountLogin: string = '';
  accountPassword: string = '';
  accountPasswordConfirm: string = '';
  accountTypeId: string = '';
  accountTypeLabel: string = '';
  accountExpiryDate: Date|null = null;
  accountNotes: string = '';
  accountLanguageId: string = '';
  accountHomePageId: string = '';
  accountMenuDisplayId: string = '';
  accountIsEnabledGoogleAgenda: boolean = false;
  accountIsAllowedSwitching: boolean = false;
  accountIsEnabledSendEmailOnBehalf: boolean = false;
  accountPrivileges: string[] = [];
  accountIsActive: boolean = true;
  accountLastLoginDate: Date|null = null;
  accountLastSeenDate: Date|null = null;
  accountLastSeenIp: string = '';
  accountLastSeenUserAgent: string = '';
  accountSwitchAccounts: Array<{ id: string; accountId: string; accountLogin: string; isRemoved: boolean; }> = [];

  /**
   * Return full name (first name + last name)
   */
  getFullName(): string {

    return [(this.firstName || ''), (this.lastName || '')].join(' ').trim();
  }

  /**
   * Return the main email value
   */
  getMainEmailAddress(): string|null {

    if (this.emails.length === 0) {

      return null;
    }

    const mainEmail = this.emails.find(email => email.isMainEmail === true);

    return mainEmail && mainEmail.emailId || null;
  }
}
