import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MlsApiService } from '../../../api/shared/mls/mls-api.service';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { MlsUpdateSearchQuery } from '../actions/mls-update-search-query';
import { MlsUpdateAgencies } from '../../data-mls/actions/mls-update-agencies';
import { MlsEventListAgencies } from '../actions/mls-event-list-agencies';
import { MlsService } from '../../../core/shared/mls/mls.service';
import { MlsUpdateSelectedAgency } from '../actions/mls-update-selected-agency';
import { MlsEventAddAgency } from '../actions/mls-event-add-agency';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MlsPageService } from '../../../core/shared/mls/mls-page.service';
import { MlsEventSearch } from '../actions/mls-event-search';
import { MlsUpdateIsLoadingAgency } from '../actions/mls-update-is-loading-agency';

@Injectable()
export class MlsEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private mlsService: MlsService,
    private pageService: MlsPageService,
    private mlsApiService: MlsApiService,
  ) {

  }

  /**
   * Perform API call to fetch mls agencies and update local records
   *
   * @action MlsEventListAgencies
   */
  MlsEventListAgencies$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MlsEventListAgencies>(MlsEventListAgencies.TYPE),
    switchMap(action => zip(
      of(action),
      this.mlsService.selectAgencies(),
    )),
    switchMap(([action, mlsAgencies]) => {

      if (mlsAgencies.length > 0) {

        return [];
      }

      // API call
      return concat(

        // Start loading
        of(new MlsUpdateIsLoadingAgency({
          isLoading: true,
        })),

        this
          .mlsApiService
          .listAgencies()
          .pipe(

            // Success
            switchMap(agencies => {

              return [

                // Update loading
                new MlsUpdateIsLoadingAgency({
                  isLoading: false,
                }),

                // Update options
                new MlsUpdateAgencies({ agencies }),
              ];
            }),

            // Error
            catchError(error => [

              // Update loading
              new MlsUpdateIsLoadingAgency({
                isLoading: false,
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_search_failure',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '71', error: error }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Update search query
   *
   * @action MlsEventSearch
   */
  MlsEventSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MlsEventSearch>(MlsEventSearch.TYPE),
    debounceTime(250),
    distinctUntilChanged(),
    switchMap(action => {

      return [

        // Update loading
        new MlsUpdateIsLoadingAgency({
          isLoading: true,
        }),

        // Update search query
        new MlsUpdateSearchQuery({
          searchQuery: action.payload.query,
        }),
      ];
    }),
  ));

  /**
   * Redirect to add page and set selected agency
   *
   * @action MlsEventAddAgency
   */
  MlsEventAddAgency: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MlsEventAddAgency>(MlsEventAddAgency.TYPE),
    switchMap(action => {

      // Redirect to read
      this.pageService.redirect(PageTypeEnum.write, null);

      return [

        // Update selected agency
        new MlsUpdateSelectedAgency({
          agency: action.payload.agency,
        }),
      ];
    }),
  ));
}
