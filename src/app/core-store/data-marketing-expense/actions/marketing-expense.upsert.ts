import { FEATURE_NAME } from '../state';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class MarketingExpenseUpsert extends UpsertAbstract<MarketingExpenseModel, DataStateInterface<MarketingExpenseModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = MarketingExpenseUpsert.TYPE;
}
