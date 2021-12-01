import { FEATURE_NAME } from '../state';
import { MatchingModel } from '../../../shared/model/matching.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class MatchingUpsert extends UpsertAbstract<MatchingModel, DataStateInterface<MatchingModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = MatchingUpsert.TYPE;
}
