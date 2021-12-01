import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { OptionInterface } from '../interface/option.interface';
import { AccountSwitchModel } from './account-switch.model';

export class AccountModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'createContact',
    'updateContact',
    'contact',
    'accountSwitches',
  ];

  id: string = '';
  createContact: ContactModel = new ContactModel();
  createDate: Date|null = null;
  updateContact: ContactModel = new ContactModel();
  updateDate: Date|null = null;
  contact: ContactModel = new ContactModel();
  accountType: OptionInterface = {
    value: '',
    text: '',
  };
  agencyId: string = '';
  login: string = '';
  password: string = '';
  passwordConfirm: string = '';
  expiryDate: Date|null = null;
  notes: string = '';
  language: OptionInterface = {
    value: '',
    text: '',
  };
  isAllowedSwitching: boolean = false;
  isEnabledSendEmailOnBehalf: boolean = false;
  isEnabledGoogleAgenda: boolean = false;
  isActive: boolean = true;
  lastLoginDate: Date|null = null;
  lastSeenDate: Date|null = null;
  lastSeenIp: string = '';
  lastSeenUserAgent: string = '';
  privileges: string[] = [];
  accountSwitches: AccountSwitchModel[] = [];
}
