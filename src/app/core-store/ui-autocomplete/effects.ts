import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AutocompleteEventSearch } from './actions/autocomplete-event-search';
import { AutocompleteUpdateSearch } from './actions/autocomplete-update-search';
import { AutocompleteApiService } from '../../api/shared/autocomplete/autocomplete-api.service';
import { AutocompleteUpdateSuggestions } from '../data-autocomplete/actions/autocomplete-update-suggestions';
import { AutocompleteUpdateOptions } from '../data-autocomplete/actions/autocomplete-update-options';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { AutocompleteUpdateIsLoading } from './actions/autocomplete-update-is-loading';
import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { AutocompleteUpdateHash } from './actions/autocomplete-update-hash';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private autocompleteApiService: AutocompleteApiService,
  ) {

  }

  /**
   * Perform API call to fetch suggestions and update local records
   *
   * @action AutocompleteEventSearch
   */
  AutocompleteEventSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AutocompleteEventSearch>(AutocompleteEventSearch.TYPE),
    debounceTime(250),
    switchMap(action => {

      // Make sure entities are always ordered
      const search = {
        ...action.payload.search,
        entities: action.payload.search.entities.slice(0),
      };
      search.entities.sort();

      const hash = JSON.stringify(search);

      return concat(

        // Start loading
        of(new AutocompleteUpdateIsLoading({
          uid: action.payload.uid,
          isLoading: true,
        })),

        // Update search
        of(new AutocompleteUpdateSearch({
          uid: action.payload.uid,
          search: search,
        })),

        // Update hash
        of(new AutocompleteUpdateHash({
          uid: action.payload.uid,
          hash: hash,
        })),

        // API call
        this
          .autocompleteApiService
          .search(action.payload.search)
          .pipe(

            // Success
            switchMap(suggestions => {

              const options = {};

              suggestions.forEach(suggestion => {

                options[suggestion.entity] = suggestion.options;
              });

              return [

                // Update options
                new AutocompleteUpdateOptions({ options }),

                // Update suggestions
                new AutocompleteUpdateSuggestions({
                  hash: hash,
                  suggestions: suggestions,
                }),

                // Stop loading
                new AutocompleteUpdateIsLoading({
                  uid: action.payload.uid,
                  isLoading: false,
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_autocomplete_search_failure',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '1', error: error }),

              // Stop loading
              new AutocompleteUpdateIsLoading({
                uid: action.payload.uid,
                isLoading: false,
              }),
            ]),
          ),
      );
    }),
  ));
}
