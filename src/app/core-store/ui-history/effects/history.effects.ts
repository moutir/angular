import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { HistoryApiService } from '../../../api/shared/history/history-api.service';
import { HistoryEventLoad } from '../actions/history-event-load';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { HistoryEventOpen } from '../actions/history-event-open';
import { HistoryUpdateHistory } from '../actions/history-update-history';
import { HistoryUpsert } from '../../data-history/actions/history-upsert';
import { HistoryUpdateByEntityHash } from '../../data-history/actions/history-update-by-entity-hash';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { HistoryEventExport } from '../actions/history-event-export';

@Injectable()
export class HistoryEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private browserService: BrowserService,
    private historyApiService: HistoryApiService,
  ) {

  }

  /**
   * Updates history state and load entity history
   *
   * @action HistoryEventOpen
   */
  HistoryEventOpen$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<HistoryEventOpen>(HistoryEventOpen.TYPE),
    switchMap(action => [

      // Update history
      new HistoryUpdateHistory({
        history: {
          entity: action.payload.entity,
          entityId: action.payload.entityId,
          entityLabel: action.payload.entityLabel,
        },
      }),

      // Load entity history
      new HistoryEventLoad({
        entity: action.payload.entity,
        entityId: action.payload.entityId,
      }),
    ]),
  ));

  /**
   * Perform API call to fetch entity history
   *
   * @action HistoryEventLoad
   */
  HistoryEventLoad$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<HistoryEventLoad>(HistoryEventLoad.TYPE),
    switchMap(action => {

      // API call
      return this
        .historyApiService
        .list(action.payload.entity, action.payload.entityId)
        .pipe(

          // Success
          switchMap(list => [

            // Upsert histories
            new HistoryUpsert({
              models: list.models,
            }),

            // Update histories by hash
            new HistoryUpdateByEntityHash({
              hash: [action.payload.entity, action.payload.entityId].join('_'),
              historyIds: list.models.map(history => history.id),
            }),
          ]),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '20', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Redirect to export URL
   *
   * @action HistoryEventExport
   */
  HistoryEventExport$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<HistoryEventExport>(HistoryEventExport.TYPE),
    switchMap(action => {

      this.browserService.blank([
        '/history/exportHistory',
        action.payload.type,
        action.payload.entity,
        action.payload.entityId,
      ].join('/'));

      return [];
    }),
  ));
}
