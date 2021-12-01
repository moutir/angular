import { OptionInterface } from './option.interface';

export interface ContractOptionsInterface {
  step: OptionInterface[];
  sellType: OptionInterface[];
  contactType: OptionInterface[];
  commissionType: OptionInterface[];
  broker: OptionInterface[];
}
