import { FEATURE_NAME } from '../state';
import { AgencyModel } from '../../../shared/model/agency.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class AgencyUpsert extends UpsertAbstract<AgencyModel, DataStateInterface<AgencyModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = AgencyUpsert.TYPE;
}
