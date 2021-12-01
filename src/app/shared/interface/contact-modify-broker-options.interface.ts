import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';

export interface ContactModifyBrokerOptionsInterface {
  broker: OptionInterface[];
  rentalBroker: OptionInterface[];
  saleBroker: OptionInterface[];
  brokerByAgency: OptionGroupInterface[];
  brokerSellByAgency: OptionGroupInterface[];
  brokerRentByAgency: OptionGroupInterface[];
}
