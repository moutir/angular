import { OptionInterface } from './option.interface';

export interface ProductionOptionsInterface {
  saleMonthly: OptionInterface[];
  saleYearly: OptionInterface[];
  rentalMonthly: OptionInterface[];
  rentalYearly: OptionInterface[];
}
