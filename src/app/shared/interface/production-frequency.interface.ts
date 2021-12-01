import { Dictionary } from '../class/dictionary';
import { ProductionValueInterface } from './production-value.interface';

export interface ProductionFrequencyInterface {
  saleMonthly: Dictionary<Dictionary<ProductionValueInterface>>;
  saleYearly: Dictionary<Dictionary<ProductionValueInterface>>;
  rentalMonthly: Dictionary<Dictionary<ProductionValueInterface>>;
  rentalYearly: Dictionary<Dictionary<ProductionValueInterface>>;
}
