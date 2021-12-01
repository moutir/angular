import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { DeviceModel } from '../../../shared/model/device.model';
import { StateInterface } from '../../../core-store/state.interface';
import { DeviceApiService } from '../../../api/shared/device/device-api.service';
import { selectDataDevice } from '../../../core-store/data-device/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { DeviceSearchModel } from '../../../shared/model/device-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { DeviceEventBlacklist } from '../../../core-store/ui-device/acttions/device-event-blacklist';

@Injectable()
export class DeviceService extends ModelServiceAbstract<DeviceModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected deviceApiService: DeviceApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): DeviceModel {

    return new DeviceModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<DeviceModel|null> {

    return this.store$.select(selectDataDevice(id));
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DeviceSearchModel,
  ): Observable<ModelListInterface<DeviceModel>> {

    return this.deviceApiService.list(pagination, sort, filters);
  }

  /**
   * Add device to blacklist
   */
  addToBlacklist(device: DeviceModel): void {

    this.store$.dispatch(
      new DeviceEventBlacklist({
        id: device.originalDeviceId,
      }),
    );
  }
}
