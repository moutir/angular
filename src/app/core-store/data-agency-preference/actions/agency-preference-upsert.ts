import { FEATURE_NAME } from '../state';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class AgencyPreferenceUpsert extends UpsertAbstract<AgencyPreferenceModel, DataStateInterface<AgencyPreferenceModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = AgencyPreferenceUpsert.TYPE;
}
