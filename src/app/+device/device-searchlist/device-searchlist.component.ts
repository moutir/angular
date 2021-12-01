import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { DeviceModel } from '../../shared/model/device.model';
import { DeviceSearchModel } from '../../shared/model/device-search.model';
import { DeviceSearchOptionsInterface } from '../../shared/interface/device-search-options.interface';
import { DeviceConfig } from '../../core/shared/device/device.config';
import { DeviceSearchlistService } from '../../core/shared/device/device-searchlist.service';
import { DeviceService } from '../../core/shared/device/device.service';
import { Observable } from 'rxjs';
import { DeviceTypeEnum } from '../../shared/enum/device-type.enum';

@Component({
  selector: 'app-device-searchlist',
  templateUrl: './device-searchlist.component.html',
})
export class DeviceSearchlistComponent extends SearchlistComponentAbstract<
  DeviceModel,
  DeviceSearchModel,
  DeviceSearchOptionsInterface
> {

  /**
   * State observables
   */
  deviceType$: Observable<DeviceTypeEnum>;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: DeviceConfig,
    protected searchlistService: DeviceSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected deviceService: DeviceService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: DeviceModel): void {

    // Do nothing
    return;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.deviceType$ = this.searchlistService.selectDeviceType(this.uid);
  }
}
