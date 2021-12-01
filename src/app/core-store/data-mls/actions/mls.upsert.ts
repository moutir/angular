import { FEATURE_NAME } from '../state';
import { MlsModel } from '../../../shared/model/mls.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class MlsUpsert extends UpsertAbstract<MlsModel, DataStateInterface<MlsModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = MlsUpsert.TYPE;
}
