import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { DeviceModel } from '../../../shared/model/device.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { DeviceSearchModel } from '../../../shared/model/device-search.model';
import { DeviceListRequestInterface } from './device-list-request.interface';
import { DeviceListResponseInterface } from './device-list-response.interface';
import { DeviceBlacklistResponseInterface } from './device-blacklist-response.interface';

@Injectable()
export class DeviceApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List devices
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DeviceSearchModel,
  ): Observable<ModelListInterface<DeviceModel>> {

    return this
      .httpService
      .post<DeviceListRequestInterface, DeviceListResponseInterface>(
        ApiEndpointEnum.deviceList,
        this.listRequest(pagination, sort, filters),
        {
          deviceType: filters.deviceType,
        },
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DeviceSearchModel,
  ): DeviceListRequestInterface {

    const request = <DeviceListRequestInterface> {
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.userId) {
      request.user_id = filters.userId;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of device models
   */
  private listResponse(response: DeviceListResponseInterface): ModelListInterface<DeviceModel> {

    return {
      models: response.data.map(data => {

        const device = new DeviceModel();
        // devices come from different tables and id is not guaranteed to be unique.
        // but device_id can guarantee uniqueness
        device.id = data.device_id;
        // store original identifier (if any) that comes from backend
        device.originalDeviceId = data.id;
        device.deviceId = data.device_id;
        device.user = data.user;

        if (data.last_login_datetime) {

          device.lastLogin = this.helperService.stringToDate(data.last_login_datetime);
        }

        if (data.blacklist_datetime) {

          device.blacklistDate = this.helperService.stringToDate(data.blacklist_datetime);
        }

        if (data.reset_datetime) {

          device.resetDate = this.helperService.stringToDate(data.reset_datetime);
        }

        if (data.blacklister) {

          device.blacklister = data.blacklister;
        }

        if (data.status) {

          device.status = data.status;
        }

        return device;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Add device to blacklist
   */
  blacklist(deviceId: string): Observable<DeviceBlacklistResponseInterface> {

    return this
    .httpService
    .post<{}, DeviceBlacklistResponseInterface>(
      ApiEndpointEnum.deviceAddToBlacklist,
      null,
      { id: deviceId },
      true,
    );
  }
}
