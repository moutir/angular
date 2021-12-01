import { ProductionFrequencyInterface } from '../../shared/interface/production-frequency.interface';

export const FEATURE_NAME = 'data-production';

export interface DataProductionStateInterface {

  // Production type per frequency
  byFrequency: ProductionFrequencyInterface;
}

export const initialState: DataProductionStateInterface = {
  byFrequency: {
    saleMonthly: {},
    saleYearly: {},
    rentalMonthly: {},
    rentalYearly: {},
  },
};
