import { FEATURE_NAME } from '../state';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';
import { AccountModel } from '../../../shared/model/account.model';

export class AccountUpsert extends UpsertAbstract<AccountModel, DataStateInterface<AccountModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = AccountUpsert.TYPE;
}
