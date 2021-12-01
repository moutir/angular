import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DeviceApiService } from '../../../api/shared/device/device-api.service';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { DeviceEventBlacklist } from '../acttions/device-event-blacklist';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';

@Injectable()
export class DeviceEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private deviceApiService: DeviceApiService,
    private confirmService: ConfirmService,
  ) {

  }

  /**
   * Perform API call to blacklist device
   *
   * @action DeviceEventBlacklist
   */
  DeviceEventBlacklist$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<DeviceEventBlacklist>(DeviceEventBlacklist.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message('confirm_device_blacklist'),
    )),
    switchMap(([action, isValid]) => isValid === false ? [] : [new EntityEventOperation({
      entity: EntityEnum.device,
      ids: [action.payload.id],
      message: 'notification_device_blacklist',
      operation: 'blacklist',
      apiCall: () => this.deviceApiService.blacklist(action.payload.id),
    })]),
  ));
}
