import { FEATURE_NAME } from '../state';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class MatchingGroupUpsert extends UpsertAbstract<MatchingGroupModel, DataStateInterface<MatchingGroupModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = MatchingGroupUpsert.TYPE;
}
