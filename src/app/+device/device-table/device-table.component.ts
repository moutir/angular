import { Component, Input } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { DeviceModel } from '../../shared/model/device.model';
import { DeviceTypeEnum } from '../../shared/enum/device-type.enum';

@Component({
  selector: 'app-device-table',
  templateUrl: './device-table.component.html',
})
export class DeviceTableComponent extends TableComponentAbstract<DeviceModel> {

  @Input() deviceType: DeviceTypeEnum;

  /**
   * Whether current table represents blacklisted devices list
   */
  isBlacklistDevicesList(): boolean {

    return this.deviceType === DeviceTypeEnum.BLACKLISTED;
  }

}
