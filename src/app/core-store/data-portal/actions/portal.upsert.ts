import { FEATURE_NAME } from '../state';
import { PortalModel } from '../../../shared/model/portal.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class PortalUpsert extends UpsertAbstract<PortalModel, DataStateInterface<PortalModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = PortalUpsert.TYPE;
}
