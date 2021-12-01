import { FEATURE_NAME } from '../state';
import { UserModel } from '../../../shared/model/user.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class UserUpsert extends UpsertAbstract<UserModel, DataStateInterface<UserModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = UserUpsert.TYPE;
}
