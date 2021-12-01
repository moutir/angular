import { FEATURE_NAME } from '../state';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class CustomAttributeUpsert extends UpsertAbstract<CustomAttributeModel, DataStateInterface<CustomAttributeModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = CustomAttributeUpsert.TYPE;
}
