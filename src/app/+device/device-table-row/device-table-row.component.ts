import { Component, Input } from '@angular/core';

import { DeviceModel } from '../../shared/model/device.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { DeviceService } from '../../core/shared/device/device.service';

@Component({
  selector: 'app-device-table-row',
  templateUrl: './device-table-row.component.html',
  styleUrls: ['./device-table-row.component.scss'],
})
export class DeviceTableRowComponent extends TableRowComponentAbstract {

  /**
   * Device to display
   */
  @Input() device: DeviceModel = new DeviceModel();

  /**
   * Constructor
   */
  constructor(
    private deviceService: DeviceService,
  ) {

    super();
  }

  /**
   * Clicked on device blacklist button
   */
  onClickBlacklist(): void {

    this.deviceService.addToBlacklist(this.getModel());
  }

  /**
   * @inheritDoc
   */
  protected getModel(): DeviceModel {

    return this.device;
  }
}
