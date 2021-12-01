import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap } from 'rxjs/operators';

import { SearchlistEventSearch } from './actions/searchlist-event-search';
import { SearchlistUpdateIsLoading } from './actions/searchlist-update-is-loading';
import { generateHash } from './selectors';
import { SearchlistEventChangeSelectionModel } from './actions/searchlist-event-change-selection-model';
import { ListSelectionTypeEnum } from '../../shared/enum/list-selection-type.enum';
import { SearchlistUpsert } from '../data-searchlist/actions/searchlist-upsert';
import { SearchlistEventChangeInput } from './actions/searchlist-event-change-input';
import { SearchlistEventChangeSelectionIds } from './actions/searchlist-event-change-selection-ids';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { SearchlistEventRemoveKeyword } from './actions/searchlist-event-remove-keyword';
import { SearchlistUpdateForm } from './actions/searchlist-update-form';
import { SearchlistUpdateSearch } from './actions/searchlist-update-search';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { SearchlistUpdateTotal } from './actions/searchlist-update-total';
import { EntityEventChanged } from '../ui-entity/actions/entity-event-changed';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { EntityIoOperationIds } from '../ui-entity/actions/entity-io-operation-ids';
import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { SearchlistEventPagination } from './actions/searchlist-event-pagination';
import { SearchOptionsInterface } from '../../shared/interface/search-options.interface';
import { SearchlistEventSubmit } from './actions/searchlist-event-submit';
import { SearchlistEventContextMenu } from './actions/searchlist-event-context-menu';
import { SearchlistEventReset } from './actions/searchlist-event-reset';
import { SearchlistEventOperation } from './actions/searchlist-event-operation';
import { SearchlistUpdateOperation } from './actions/searchlist-update-operation';
import { SearchlistEventSort } from './actions/searchlist-event-sort';
import { SearchlistEventToggleForm } from './actions/searchlist-event-toggle-form';
import { SearchlistUpdateIsFormAdvanced } from './actions/searchlist-update-is-form-advanced';
import { SearchlistUpdateSelection } from './actions/searchlist-update-selection';
import { SearchlistEventChangeSelectionType } from './actions/searchlist-event-change-selection-type';
import { SearchlistEventReload } from './actions/searchlist-event-reload';
import { SearchlistEventSubmitByRoute } from './actions/searchlist-event-submit-by-route';
import { SearchlistServiceAbstract } from '../../shared/service/searchlist.service.abstract';
import { ListFiltersInterface } from '../../shared/interface/list-filters.interface';
import { SearchlistEventSubmitByForm } from './actions/searchlist-event-submit-by-form';
import { SearchlistEventSubmitByTab } from './actions/searchlist-event-submit-by-tab';
import { SearchlistEventSaveParams } from './actions/searchlist-event-save-params';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { UserEventSavePreference } from '../ui-user/actions/user-event-save-preference';
import { SearchlistEventSubmitByFilters } from './actions/searchlist-event-submit-by-filters';
import { ModelServiceAbstract } from '../../shared/service/model-service.abstract';
import { SearchlistEventSubmitBySearch } from './actions/searchlist-event-submit-by-search';
import { SearchlistEventCount } from './actions/searchlist-event-count';

export abstract class EffectsAbstract<
  Model extends ModelAbstract,
  Filters extends ListFiltersInterface,
  Options extends SearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
     protected actions$: Actions,
     protected runtimeService: RuntimeService,
     protected modelService: ModelServiceAbstract<Model>,
     protected searchlistService: SearchlistServiceAbstract<Model, Filters, Options>,
  ) {

  }

  /**
   * Perform API call to fetch results and update local records when search is requested
   *
   * @action SearchlistEventSearch
   */
  SearchlistEventSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSearch>(SearchlistEventSearch.TYPE),
    debounceTime(250),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectCurrentHash(action.payload.uid),
    )),
    switchMap(([action, currentHash]) => {

      return concat(

        // Start loading
        of(new SearchlistUpdateIsLoading({
          uid: action.payload.uid,
          isLoading: true,
        })),

        // API call "list"
        this
          .modelService
          .list(action.payload.search.pagination, action.payload.search.sort, action.payload.search.filters)
          .pipe(

            // Success
            switchMap(list => {

              const actions = [

                // Upsert data models
                this.getUpsertAction(list.models),

                // Update searchlist
                new SearchlistUpsert({
                  hash: generateHash(action.payload.uid, action.payload.search),
                  total: list.total,
                  ids: list.models.map(model => model.id),
                }),

                // Stop loading
                new SearchlistUpdateIsLoading({
                  uid: action.payload.uid,
                  isLoading: false,
                }),
              ];

              // No total provided
              if (list.total === null) {

                actions.push(
                  new SearchlistEventCount({
                    uid: action.payload.uid,
                    filters: action.payload.search.filters,
                  }),
                );
              }

              return actions;
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_search_failure',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '14', error: error }),

              // Stop loading
              new SearchlistUpdateIsLoading({
                uid: action.payload.uid,
                isLoading: false,
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Count results
   *
   * @action SearchlistEventCount
   */
  SearchlistEventCount$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventCount>(SearchlistEventCount.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => {

      // API call "count"
      return this
        .modelService
        .count(action.payload.filters)
        .pipe(
          map(count => {

            // Update displayed total
            return new SearchlistUpdateTotal({
              uid: action.payload.uid,
              total: count,
            });
          }),
        );
    })));

  /**
   * Update pagination and search when submitting searchlist with specific filters
   *
   * @action SearchlistEventSubmit
   */
  SearchlistEventSubmit$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmit>(SearchlistEventSubmit.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => [

      // Update form
      new SearchlistUpdateForm({
        uid: action.payload.uid,
        form: action.payload.filters,
      }),

      // Update selection
      new SearchlistEventChangeSelectionIds({
        uid: action.payload.uid,
        ids: [],
      }),

      // Update total
      new SearchlistUpdateTotal({
        uid: action.payload.uid,
        total: 0,
      }),

      // Update search
      new SearchlistUpdateSearch({
        uid: action.payload.uid,
        search: {
          filters: action.payload.filters,
          sort: action.payload.sort,
          pagination: action.payload.pagination,
        },
      }),
    ]),
  ));

  /**
   * Submit current search on reload event
   *
   * @action SearchlistEventReload
   */
  SearchlistEventReload$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventReload>(SearchlistEventReload.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
    )),
    map(([action, search]) => new SearchlistEventSubmit({
      uid: action.payload.uid,
      filters: search.filters,
      sort: search.sort,
      pagination: search.pagination,
    })),
  ));

  /**
   * Perform search when updating current search
   *
   * @action SearchlistUpdateSearch
   */
  SearchlistUpdateSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistUpdateSearch>(SearchlistUpdateSearch.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
    )),
    map(([action, search]) => {

      // Perform search
      return new SearchlistEventSearch({
        uid: action.payload.uid,
        search,
      });
    }),
  ));

  /**
   * Search on new pagination
   *
   * @action SearchlistEventPagination
   */
  SearchlistEventPagination$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventPagination>(SearchlistEventPagination.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
    )),
    map(([action, search]) => new SearchlistUpdateSearch({
      uid: action.payload.uid,
      search: {
        ...search,
        pagination: {
          ...action.payload.pagination,
        },
      },
    }))));

  /**
   * Search on new sort
   *
   * @action SearchlistEventSort
   */
  SearchlistEventSort$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSort>(SearchlistEventSort.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
    )),
    map(([action, search]) => new SearchlistUpdateSearch({
      uid: action.payload.uid,
      search: {
        ...search,
        sort: action.payload.sort,
        pagination: {
          ...search.pagination,
          page: 1,
        },
      },
    }))));

  /**
   * Update selection when changed selection IDs
   *
   * @action SearchlistEventChangeSelectionIds
   */
  SearchlistEventChangeSelectionIds$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeSelectionIds>(SearchlistEventChangeSelectionIds.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
      this.searchlistService.selectModelsSelectable(action.payload.uid),
    )),
    map(([action, selection, modelsSelectable]) => new SearchlistUpdateSelection({
      uid: action.payload.uid,
      selection: {
        ...selection,
        isSelectedAll: modelsSelectable.some(model => action.payload.ids.indexOf(model.id) === -1) ? false : selection.isSelectedAll,
        ids: action.payload.ids,
        isLoading: false,
      },
    }))));

  /**
   * Update selection IDs when updating selection model
   *
   * @action SearchlistEventChangeSelectionModel
   */
  SearchlistEventChangeSelectionModel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeSelectionModel>(SearchlistEventChangeSelectionModel.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    switchMap(([action, selection]) => {

      let ids = selection.ids.slice(0);

      // Adding an ID
      if (action.payload.isSelected === true && ids.indexOf(action.payload.model.id) === -1) {

        ids.push(action.payload.model.id);
      }

      // Removing an ID
      if (action.payload.isSelected === false) {

        ids = ids.filter(id => id !== action.payload.model.id);
      }

      // Update selection IDs
      return of(new SearchlistEventChangeSelectionIds({
        uid: action.payload.uid,
        ids: ids,
      }));
    }),
  ));

  /**
   * Update selection IDs when updating selection type
   *
   * @action SearchlistEventChangeSelectionType
   */
  SearchlistEventChangeSelectionType$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeSelectionType>(SearchlistEventChangeSelectionType.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectFilters(action.payload.uid),
      this.searchlistService.selectSelection(action.payload.uid),
      this.searchlistService.selectModelsSelectable(action.payload.uid),
    )),
    switchMap(([action, filters, selection, modelsSelectable]) => {

      // Selected all records
      if (action.payload.type === ListSelectionTypeEnum.all) {

        return concat(

          // Update selection
          of(new SearchlistUpdateSelection({
            uid: action.payload.uid,
            selection: {
              ...selection,
              isSelectedAll: true,
              ids: modelsSelectable.map(model => model.id),
              isLoading: true,
            },
          })),

          // API call
          this
            .modelService
            .ids(filters)
            .pipe(

              // Success
              map(ids => new SearchlistUpdateSelection({
                uid: action.payload.uid,
                selection: {
                  isSelectedAll: true,
                  ids: ids,
                  isLoading: false,
                },
              })),

              // Error
              catchError(error => [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_search_failure',
                }),

                // Broadcast error
                new RuntimeEventError({ id: '15', error: error }),

                // Update selection
                new SearchlistUpdateSelection({
                  uid: action.payload.uid,
                  selection: {
                    isSelectedAll: false,
                    ids: [],
                    isLoading: false,
                  },
                }),
              ]),
            ),
        );
      }

      let selectionIds: string[] = selection.ids.slice(0);

      // Select page
      if (action.payload.type === ListSelectionTypeEnum.page) {

        // Add all selectable models to current selection, preventing duplicates
        modelsSelectable.forEach(model => {

          if (selectionIds.indexOf(model.id) === -1) {

            selectionIds.push(model.id);
          }
        });
      }

      // Select unpage
      if (action.payload.type === ListSelectionTypeEnum.unpage) {

        // Remove all selectable models from current selection
        const idsSelectable = modelsSelectable.map(model => model.id);
        selectionIds = selectionIds.filter(id => idsSelectable.indexOf(id) === -1);
      }

      // Select none
      if (action.payload.type === ListSelectionTypeEnum.none) {

        selectionIds = [];
      }

      return of(new SearchlistUpdateSelection({
        uid: action.payload.uid,
        selection: {
          isSelectedAll: false,
          ids: selectionIds,
          isLoading: false,
        },
      }));
    }),
  ));

  /**
   * Toggle form expand/collapse state
   *
   * @action SearchlistEventToggleForm
   */
  SearchlistEventToggleForm$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventToggleForm>(SearchlistEventToggleForm.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectIsFormAdvanced(action.payload.uid),
    )),
    map(([action, isFormAdvanced]) => new SearchlistUpdateIsFormAdvanced({
      uid: action.payload.uid,
      isFormAdvanced: !isFormAdvanced,
    }))));

  /**
   * Updates form input when keyword has been removed
   *
   * @action SearchlistEventRemoveKeyword
   */
  SearchlistEventRemoveKeyword$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventRemoveKeyword>(SearchlistEventRemoveKeyword.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearchlist(action.payload.uid),
      this.searchlistService.selectForm(action.payload.uid),
    )),
    map(([action, state, form]) => {

      // Initial value
      let value = this.searchlistService.getEmptyFilters()[action.payload.keyword.name] || null;

      // Current value is an array
      if (state.form[action.payload.keyword.name] instanceof Array) {

        // Remove keyword's value
        value = state.form[action.payload.keyword.name].filter(val => val !== action.payload.keyword.value);
      }

      const model = {
        ...form,
      };

      model[action.payload.keyword.name] = value;

      // Update form input with new input
      return new SearchlistEventChangeInput({
        uid: action.payload.uid,
        input: {
          name: action.payload.keyword.name,
          value: value,
        },
        model: model,
      });
    }),
  ));

  /**
   * Updates form state when form input has been updated
   *
   * @action SearchlistEventChangeInput
   */
  SearchlistEventChangeInput$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeInput>(SearchlistEventChangeInput.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearchlist(action.payload.uid),
    )),
    switchMap(([action, searchlist]) => {

      const newForm = {
        ...action.payload.model,
      };

      // Replace empty string by null (no selection)
      newForm[action.payload.input.name] = action.payload.input.value === '' ? null : action.payload.input.value;

      // Value did not change
      if (searchlist.search.filters[action.payload.input.name] === action.payload.model[action.payload.input.name]) {

        return [];
      }

      return [

        // Update form
        new SearchlistUpdateForm({
          uid: action.payload.uid,
          form: newForm,
        }),
      ];
    }),
  ));

  /**
   * Perform search on action impacting searchlist results
   *
   * @action EntityEventChanged
   */
  EntityEventChanged$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectState(),
    )),
    switchMap(([action, state]) => {

      const actions = [];

      // For each searchlist
      Object
        .keys(state)
        .forEach(uid => {

          // Not the correct entity searchlist
          if (this.filterEntity(uid, action.payload.entity) === false) {

            return;
          }

          // Search for updated records
          actions.push(
            new SearchlistEventSearch({
              uid: uid,
              search: state[uid].search,
            }),
          );

          // Empty selection
          actions.push(
            new SearchlistEventChangeSelectionIds({
              uid: uid,
              ids: [],
            }),
          );
        });

      return actions;
    }),
  ));

  /**
   * Remove from selection properties being part of an operation
   *
   * @action EntityIoOperationIds
   */
  EntityIoOperationIds$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityIoOperationIds>(EntityIoOperationIds.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectState(),
      this.searchlistService.selectOperationIds(),
    )),
    switchMap(([action, state, operationIds]) => {

      const actions = [];

      // For each searchlist
      Object
        .keys(state)
        .forEach(uid => {

          // Not the correct entity searchlist
          if (this.filterEntity(uid, action.payload.entity) === false) {

            return;
          }

          // Update selection
          actions.push(
            new SearchlistEventChangeSelectionIds({
              uid: uid,
              ids: state[uid].selection.ids.filter(id => operationIds.indexOf(id) === -1),
            }),
          );
        });

      return actions;
    }),
  ));

  /**
   * Update selection upon contextual menu on a model
   *
   * @action SearchlistEventContextMenu
   */
  SearchlistEventContextMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventContextMenu>(SearchlistEventContextMenu.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
      this.searchlistService.selectModelsSelectable(action.payload.uid),
    )),
    switchMap(([action, selection, modelsSelectable]) => {

      // Model not selectable
      if (modelsSelectable.every(model => model.id !== action.payload.model.id)) {

        return [];
      }

      // Model already selected
      if (selection.ids.indexOf(action.payload.model.id) > -1) {

        return [];
      }

      return [

        // Only select model
        new SearchlistEventChangeSelectionIds({
          uid: action.payload.uid,
          ids: [action.payload.model.id],
        }),
      ];
    }),
  ));

  /**
   * Submit search with empty filters
   *
   * @action SearchlistEventReset
   */
  SearchlistEventReset$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventReset>(SearchlistEventReset.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectKeywords(action.payload.uid),
      this.searchlistService.selectSearch(action.payload.uid),
    )),
    map(([action, keywords, search]) => {

      // Initial form
      const newFilters = this.searchlistService.getEmptyFilters();

      // None removable keywords
      keywords
        .filter(keyword => keyword.isRemovable !== true)
        .forEach(keyword => {

          if (newFilters[keyword.name] instanceof Array) {

            newFilters[keyword.name].push(keyword.value);

          } else {

            newFilters[keyword.name] = keyword.value;
          }
        });

      // Submit search
      return new SearchlistEventSubmit({
        uid: action.payload.uid,
        filters: newFilters,
        sort: search.sort,
        pagination: {
          ...search.pagination,
          page: 1,
        },
      });
    }),
  ));

  /**
   * Update current operation when launching operation
   *
   * @action SearchlistEventOperation
   */
  SearchlistEventOperation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    map(action => new SearchlistUpdateOperation({
      uid: action.payload.uid,
      operation: action.payload.operation,
    })),
  ));

  /**
   * Submit search using params in this order of priority Route Query Params > User Preference > Default
   *
   * @action SearchlistEventSubmitByRoute
   */
  SearchlistEventSubmitByRoute$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmitByRoute>(SearchlistEventSubmitByRoute.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearchRoute(action.payload.queryParams),
      this.searchlistService.selectSearchPreference(action.payload.uid),
      this.searchlistService.selectSearchDefault(),
    )),
    map(([action, routeSearch, preferenceSearch, defaultSearch]) => new SearchlistEventSubmit({
      uid: action.payload.uid,
      filters: routeSearch.filters || preferenceSearch.filters || defaultSearch.filters,
      sort: routeSearch.sort || preferenceSearch.sort || defaultSearch.sort,
      pagination: routeSearch.pagination || preferenceSearch.pagination || defaultSearch.pagination,
    })),
  ));

  /**
   * Submit search using params in this order of priority: Previous search > Default search
   *
   * @action SearchlistEventSubmitBySearch
   */
  SearchlistEventSubmitBySearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmitBySearch>(SearchlistEventSubmitBySearch.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
      this.searchlistService.selectSearchDefault(),
    )),
    map(([action, prevSearch, defaultSearch]) => new SearchlistEventSubmit({
      uid: action.payload.uid,
      filters: prevSearch.filters || defaultSearch.filters,
      sort: prevSearch.sort || defaultSearch.sort,
      pagination: prevSearch.pagination || defaultSearch.pagination,
    })),
  ));

  /**
   * Submit search using partial filters
   *
   * @action SearchlistEventSubmitByFilters
   */
  SearchlistEventSubmitByFilters$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmitByFilters>(SearchlistEventSubmitByFilters.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    map(action => {

      // Get empty filters
      const filters = this.searchlistService.getEmptyFilters();

      // Override with partial filters
      Object
        .keys(action.payload.filters)
        .forEach(key => filters[key] = action.payload.filters[key]);

      return new SearchlistEventSubmit({
        uid: action.payload.uid,
        filters: filters,
        sort: action.payload.sort,
        pagination: action.payload.pagination,
      });
    }),
  ));

  /**
   * Submit search using current search and overriding one filter with a tab index option
   *
   * @action SearchlistEventSubmitByTab
   */
  SearchlistEventSubmitByTab$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmitByTab>(SearchlistEventSubmitByTab.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
      this.searchlistService.selectFormOptions(action.payload.uid),
    )),
    map(([action, search, formOptions]) => {

      const newFilters = {
        ...search.filters,
      };

      const option = formOptions[action.payload.inputName] && formOptions[action.payload.inputName][action.payload.optionIndex];

      newFilters[action.payload.inputName] = option ? option.value : null;

      return new SearchlistEventSubmit({
        uid: action.payload.uid,
        filters: newFilters,
        sort: search.sort,
        pagination: {
          ...search.pagination,
          page: 1,
        },
      });
    }),
  ));

  /**
   * Submit search using current form
   *
   * @action SearchlistEventSubmitByForm
   */
  SearchlistEventSubmitByForm$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmitByForm>(SearchlistEventSubmitByForm.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
      this.searchlistService.selectForm(action.payload.uid),
    )),
    map(([action, search, form]) => new SearchlistEventSubmit({
      uid: action.payload.uid,
      filters: form,
      sort: search.sort,
      pagination: {
        ...search.pagination,
        page: 1,
      },
    })),
  ));

  /**
   * Update user preference when saving search params
   *
   * @action SearchlistEventSaveParams
   */
  SearchlistEventSaveParams$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSaveParams>(SearchlistEventSaveParams.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSearch(action.payload.uid),
      this.searchlistService.selectForm(action.payload.uid),
      this.runtimeService.selectUserPreference(),
    )),
    switchMap(([action, search, form, userPreference]) => {

      const newUserPreference = {
        ...userPreference,
        searchlist: {
          ...userPreference.searchlist,
        },
      };

      newUserPreference.searchlist[action.payload.uid] = {
        filters: form,
        sort: search.sort,
        pagination: {
          ...search.pagination,
          page: 1,
        },
      };

      return [

        // Save user preference
        new UserEventSavePreference({
          preference: newUserPreference,
        }),

        // Submit by form
        new SearchlistEventSubmitByForm({
          uid: action.payload.uid,
        }),
      ];
    }),
  ));

  /**
   * Return true if the UID matches the entity, if no entity provided, uses searchlist' entity.
   */
  protected filterEntity(uid: string|EntityEnum, entity: EntityEnum|null = null): boolean {

    if (entity === null) {

      entity = this.searchlistService.getEntity();
    }

    return uid === entity || uid.split(/:/)[1] === entity;
  }

  /**
   * Return the upsert action instance for the models passed in argument
   */
  protected abstract getUpsertAction(models: Model[]): Action;
}
