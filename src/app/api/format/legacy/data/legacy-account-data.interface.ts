import { LegacyContactDataInterface } from './legacy-contact-data.interface';
import { OptionInterface } from '../../../../shared/interface/option.interface';

export interface LegacyAccountDataInterface {
  id: string;
  createDatetime: string|null;
  createAccountId: string|null;
  createContact: LegacyContactDataInterface|null;
  updateDatetime: string|null;
  updateAccountId: string|null;
  updateContact: LegacyContactDataInterface|null;
  contact: LegacyContactDataInterface|null;
  accountType: OptionInterface;
  login: string;
  password: string;
  passwordConfirm: string;
  isActive: boolean;
  expiryDate: string;
  notes: string;
  language: OptionInterface;
  allowSwitchingToThisAccount: boolean;
  allowSendOnBehalf: boolean;
  isEnabledGoogleAgenda: boolean;
  lastLoginDate: string;
  lastSeenDate: string;
  lastSeenIp: string;
  lastSeenUserAgent: string;
}
