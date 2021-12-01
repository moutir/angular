import { FEATURE_NAME } from '../state';
import { LeadModel } from '../../../shared/model/lead.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class LeadUpsert extends UpsertAbstract<LeadModel, DataStateInterface<LeadModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = LeadUpsert.TYPE;
}
