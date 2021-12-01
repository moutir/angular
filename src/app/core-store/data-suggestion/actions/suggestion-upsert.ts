import { FEATURE_NAME } from '../state';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class SuggestionUpsert extends UpsertAbstract<SuggestionModel, DataStateInterface<SuggestionModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = SuggestionUpsert.TYPE;
}
