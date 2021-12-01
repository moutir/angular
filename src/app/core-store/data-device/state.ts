import { DeviceModel } from '../../shared/model/device.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-device';

export interface DataDeviceStateInterface extends DataStateInterface<DeviceModel> {

}

export const initialState: DataDeviceStateInterface = {
  models: {},
};
