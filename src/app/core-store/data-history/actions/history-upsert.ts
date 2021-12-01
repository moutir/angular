import { FEATURE_NAME } from '../state';
import { HistoryModel } from '../../../shared/model/history.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class HistoryUpsert extends UpsertAbstract<HistoryModel, DataStateInterface<HistoryModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = HistoryUpsert.TYPE;
}
