import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { DeviceModel } from '../../../shared/model/device.model';
import { DevicePageService } from '../../../core/shared/device/device-page-service';
import { DeviceService } from '../../../core/shared/device/device.service';
import { DeviceUpsert } from '../../data-device/actions/device.upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<DeviceModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: DevicePageService,
    protected modelService: DeviceService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: DeviceModel): Action {

    return new DeviceUpsert({
      models: [model],
    });
  }
}
