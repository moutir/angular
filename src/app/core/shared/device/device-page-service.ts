import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { DeviceModel } from '../../../shared/model/device.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DeviceConfig } from './device.config';
import { DeviceService } from './device.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class DevicePageService extends PageServiceAbstract<DeviceModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: DeviceConfig,
    protected modelService: DeviceService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }
}
