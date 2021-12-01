import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { CanDeactivateComponentInterface } from '../../shared/interface/can-deactivate-component.interface';
import { ConfirmService } from './confirm.service';

@Injectable()
export class CanDeactivateRouteGuard implements CanDeactivate<CanDeactivateComponentInterface> {

  /**
   * Constructor
   */
  constructor(
    private confirmService: ConfirmService,
  ) {

  }

  /**
   * Can deactivate
   */
  canDeactivate(component: CanDeactivateComponentInterface): Observable<boolean> {

    return component
      .canDeactivate()
      .pipe(
        take(1),
        switchMap(canDeactivate => canDeactivate === false ? this.confirmService.message('confirm_discard_changes') : of(true)));
  }
}
