import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SectorEventRemove } from '../actions/sector-event-remove';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { SectorPageService } from '../../../core/shared/sector/sector-page.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { SectorApiService } from '../../../api/shared/sector/sector-api.service';

@Injectable()
export class SectorEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private confirmService: ConfirmService,
    private sectorApiService: SectorApiService,
    private pageService: SectorPageService,
  ) {

  }

  /**
   * Perform API call to remove sector
   *
   * @action SectorEventRemove
   */
  SectorEventRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SectorEventRemove>(SectorEventRemove.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        'confirm_sector_remove_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.sector,
          ids: [action.payload.id],
          message: 'notification_sector_remove',
          operation: 'remove',
          apiCall: () => this.sectorApiService.remove(action.payload.id).pipe(
            map(response => {

              if (response === true) {

                // Redirect to list
                this.pageService.redirect(PageTypeEnum.list, null);
              }

              return response;
            }),
          ),
        }),
      );

      return actions;
    }),
  ));
}
