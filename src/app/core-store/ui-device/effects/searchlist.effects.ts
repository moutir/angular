import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DeviceModel } from '../../../shared/model/device.model';
import { DeviceSearchlistService } from '../../../core/shared/device/device-searchlist.service';
import { DeviceUpsert } from '../../data-device/actions/device.upsert';
import { DeviceSearchModel } from '../../../shared/model/device-search.model';
import { DeviceSearchOptionsInterface } from '../../../shared/interface/device-search-options.interface';
import { DeviceService } from '../../../core/shared/device/device.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  DeviceModel,
  DeviceSearchModel,
  DeviceSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: DeviceService,
    protected searchlistService: DeviceSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): DeviceUpsert {

    return new DeviceUpsert({
      models: <DeviceModel[]>models,
    });
  }
}
