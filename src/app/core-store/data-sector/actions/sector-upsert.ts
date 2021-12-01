import { FEATURE_NAME } from '../state';
import { SectorModel } from '../../../shared/model/sector.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class SectorUpsert extends UpsertAbstract<SectorModel, DataStateInterface<SectorModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = SectorUpsert.TYPE;
}
