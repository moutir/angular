import { FEATURE_NAME } from '../state';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class ReportingUpsert extends UpsertAbstract<ReportingModel, DataStateInterface<ReportingModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = ReportingUpsert.TYPE;
}
