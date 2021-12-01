import { FEATURE_NAME } from '../state';
import { ProcessModel } from '../../../shared/model/process.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class ProcessUpsert extends UpsertAbstract<ProcessModel, DataStateInterface<ProcessModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = ProcessUpsert.TYPE;
}
