import { ContactPhoneModel } from './contact-phone.model';
import { ContactEmailModel } from './contact-email.model';
import { ContactAddressModel } from './contact-address.model';
import { ModelAbstract } from '../class/model.abstract';
import { DocumentModel } from './document.model';
import { ContactSocialModel } from './contact-social.model';
import { ContactModel } from './contact.model';

export class AgencyModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'mobiles',
    'landlines',
    'emails',
    'addresses',
    'images',
    'documents',
    'socials',
    'logo',
    'watermark',
    'defaultPropertyPhoto',
    'prestigeBrochureCover',
    'emailBanner',
    'contacts',
  ];

  /**
   * List of this class' attributes that are marked as special images
   */
  readonly IMAGE_DOCUMENT_ATTRIBUTES: Array<keyof AgencyModel> = [
    'logo',
    'watermark',
    'defaultPropertyPhoto',
    'prestigeBrochureCover',
    'emailBanner',
  ];

  /**
   * ID
   */
  id: string = '';

  /**
   * Is the agency active ?
   */
  isActive: boolean|null = null;

  /**
   * Name
   */
  name: string = '';

  /**
   * Reference
   */
  reference: string = '';

  /**
   * Phone number for sales
   */
  phoneSales: string = '';

  /**
   * Phone number for rentals
   */
  phoneRentals: string = '';

  /**
   * Email for sales
   */
  emailSales: string = '';

  /**
   * Email for rentals
   */
  emailRentals: string = '';

  /**
   * Fax
   */
  fax: string = '';

  /**
   * Main address
   */
  mainAddress: string = '';

  /**
   * Zip code
   */
  zipCode: string = '';

  /**
   * City
   */
  city: string = '';

  /**
   * Country
   */
  countryId: string = '';

  /**
   * Country label
   */
  countryLabel: string = '';

  /**
   * Description
   */
  description: string = '';

  /**
   * Founding year
   */
  foundingYear: string = '';

  /**
   * Founder
   */
  founder: string = '';

  /**
   * Director
   */
  director: string = '';

  /**
   * President
   */
  president: string = '';

  /**
   * Administrator
   */
  administrator: string = '';

  /**
   * Number of employees
   */
  employeeCount: string = '';

  /**
   * Mobile numbers
   */
  mobiles: ContactPhoneModel[] = [];

  /**
   * Landline numbers
   */
  landlines: ContactPhoneModel[] = [];

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
   * Images
   */
  images: DocumentModel[] = [];

  /**
   * Documents
   */
  documents: DocumentModel[] = [];

  /**
   * Agency logo
   */
  logo: DocumentModel = null;

  /**
   * Agency watermark
   */
  watermark: DocumentModel = null;

  /**
   * Default property photo
   */
  defaultPropertyPhoto: DocumentModel = null;

  /**
   * Prestige brochure cover
   */
  prestigeBrochureCover: DocumentModel = null;

  /**
   * Email banner
   */
  emailBanner: DocumentModel = null;

  /**
   * Main person of contact
   */
  contactName: string = '';

  /**
   * Contract options
   */
  contractOptions: Array<{label: string, id: string, isActive: boolean}> = [];

  /**
   * Email template ID
   */
  emailTemplateId: string = '';

  /**
   * Watermark opacity
   */
  watermarkOpacity: number = 100;

  /**
   * Header & footer background colour
   */
  bgColorHeaderFooter: string = '';

  /**
   * Header & footer text colour
   */
  textColorHeaderFooter: string = '';

  /**
   * Main background colour
   */
  bgColorMain: string = '';

  /**
   * Main text colour
   */
  textColorMain: string = '';

  /**
   * Message background colour
   */
  bgColorMessage: string = '';

  /**
   * Message text colour
   */
  textColorMessage: string = '';

  /**
   * Title background colour
   */
  bgColorTitle: string = '';

  /**
   * Title text colour
   */
  textColorTitle: string = '';

  /**
   * Head quarters
   */
  headQuarters: string = '';

  /**
   * Branches
   */
  branches: string = '';

  /**
   * Whitelisted domains
   */
  whitelistedDomains: string[] = [];

  /**
   * Agency contacts
   */
  contacts: ContactModel[] = [];

  /**
   * Number of sale searches
   */
  saleSearchCount: number = null;

  /**
   * Number of rental searches
   */
  rentalSearchCount: number = null;

  /**
   * Number of sale listings
   */
  saleListingCount: number = null;

  /**
   * Number of rental listings
   */
  rentalListingCount: number = null;

  /**
   * Apply watermark on brochures ?
   */
  isAppliedWatermarkOnBrochure: boolean = false;

  /**
   * Apply watermark on portals ?
   */
  isAppliedWatermarkOnPortal: boolean = false;

  /**
   * Apply watermark on website ?
   */
  isAppliedWatermarkOnWebsite: boolean = false;

  /**
   * Show statistics on MLS ?
   */
  isShownStatisticsOnMls: boolean = false;

  /**
   * Allowed to send an MLS invite ?
   */
   isAllowedSendMLSInvite: boolean = false;

  /**
   * Created date
   */
  createDate: Date|null = null;

  /**
   * Updated contact
   */
  updateDate: Date|null = null;

  /**
   * Created and updated contacts (Contact model is flattened to avoid circular dependancy)
   */
  createContactId: string = '';
  createContactName: string = '';
  updateContactId: string = '';
  updateContactName: string = '';

  // UI usage
  isLoading: boolean = false;
}
