import { AccountOptionsInterface } from './account-options.interface';
import { ContactOptionsInterface } from './contact-options.interface';

export interface UserOptionsInterface {
  account: AccountOptionsInterface;
  contact: ContactOptionsInterface;
}
