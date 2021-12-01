import { FEATURE_NAME } from '../state';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class RestrictionUpsert extends UpsertAbstract<RestrictionModel, DataStateInterface<RestrictionModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = RestrictionUpsert.TYPE;
}
