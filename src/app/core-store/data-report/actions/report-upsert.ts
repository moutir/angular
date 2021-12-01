import { FEATURE_NAME } from '../state';
import { ReportModel } from '../../../shared/model/report.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class ReportUpsert extends UpsertAbstract<ReportModel, DataStateInterface<ReportModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = ReportUpsert.TYPE;
}
