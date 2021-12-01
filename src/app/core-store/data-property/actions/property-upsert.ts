import { FEATURE_NAME } from '../state';
import { PropertyModel } from '../../../shared/model/property.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class PropertyUpsert extends UpsertAbstract<PropertyModel, DataStateInterface<PropertyModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = PropertyUpsert.TYPE;
}
