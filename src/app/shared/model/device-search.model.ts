import { ListFiltersInterface } from '../interface/list-filters.interface';
import { DeviceTypeEnum } from '../enum/device-type.enum';
import { ModelAbstract } from '../class/model.abstract';

export class DeviceSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  deviceType: DeviceTypeEnum = DeviceTypeEnum.ALL;
  userId: string|null = null;
}
