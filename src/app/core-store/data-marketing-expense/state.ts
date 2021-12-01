import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-marketing-expense';

export interface DataMarketingExpenseStateInterface extends DataStateInterface<MarketingExpenseModel> {

}

export const initialState: DataMarketingExpenseStateInterface = {
  models: {},
};
