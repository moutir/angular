import { ModelAbstract } from '../class/model.abstract';

export class DeviceModel extends ModelAbstract {
  id: string = '';
  originalDeviceId: string = '';
  deviceId: string = '';
  lastLogin: Date | null = null;
  user: string = '';
  blacklister: string = '';
  blacklistDate: Date | null = null;
  resetDate: Date | null = null;
  status: string = '';
}
