import { LegacyAgencyDataInterface } from './legacy-agency-data.interface';
import { LegacySearchDataInterface } from './legacy-search-data.interface';
import { ContactTypeEnum } from '../../../../shared/enum/contact-type.enum';
import { PhoneTypeEnum } from '../../../../shared/enum/phone-type.enum';

export interface LegacyContactDataInterface {
  id: string;
  reference: string;
  firstname: string;
  lastname: string;
  initials: string;
  lastContactDate: string;
  ranking: string;
  agency: LegacyAgencyDataInterface;
  mainContact: LegacyContactDataInterface|null;
  saleContact: LegacyContactDataInterface|null;
  rentalContact: LegacyContactDataInterface|null;
  createContact: LegacyContactDataInterface|null;
  updateContact: LegacyContactDataInterface|null;
  searches: LegacySearchDataInterface[];
  isConfidential: boolean;
  contactTypeIds: ContactTypeEnum[];
  emails: Array<{ value: string; isInvalid: boolean; }>;
  phones: Array<{ number: string; type: PhoneTypeEnum; }>;
}
