import { FEATURE_NAME } from '../state';
import { DeviceModel } from '../../../shared/model/device.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class DeviceUpsert extends UpsertAbstract<DeviceModel, DataStateInterface<DeviceModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = DeviceUpsert.TYPE;
}
