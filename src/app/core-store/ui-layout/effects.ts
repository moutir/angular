import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { RuntimeUpdateContextual } from '../ui-runtime/actions/runtime-update-contextual';
import { LayoutEventUserMenu } from './actions/layout-event-user-menu';
import { LayoutEventOperation } from './actions/layout-event-operation';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { LayoutUpdateSidenav } from './actions/layout-update-sidenav';
import { LayoutEventSearch } from './actions/layout-event-search';
import { LayoutUpdateSearch } from './actions/layout-update-search';
import { LayoutService } from '../../layout/shared/layout.service';
import { LayoutEventToggleSearch } from './actions/layout-event-toggle-search';
import { ContactService } from '../../core/shared/contact/contact.service';
import { ContactSearchlistService } from '../../core/shared/contact/contact-searchlist.service';
import { ContactSearchModel } from '../../shared/model/contact-search.model';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { ContactUpsert } from '../data-contact/actions/contact-upsert';
import { LayoutEventSearchEntity } from './actions/layout-event-search-entity';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteApiService } from '../../api/shared/autocomplete/autocomplete-api.service';
import { AutocompleteSearchInterface } from '../../shared/interface/autocomplete-search.interface';
import { PromotionService } from '../../core/shared/promotion/promotion.service';
import { PropertyService } from '../../core/shared/property/property.service';
import { PropertySearchModel } from '../../shared/model/property-search.model';
import { PropertyUpsert } from '../data-property/actions/property-upsert';
import { PaginationInterface } from '../../shared/interface/pagination.interface';
import { SortInterface } from '../../shared/interface/sort.interface';
import { PromotionSearchModel } from '../../shared/model/promotion-search.model';
import { PromotionUpsert } from '../data-promotion/actions/promotion-upsert';
import { initialState } from './state';
import { OrderEnum } from '../../shared/enum/order.enum';
import { selectDataAuthentication } from '../data-runtime/selectors';
import { ListTypeEnum } from '../../shared/enum/list-type.enum';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
    private layoutService: LayoutService,
    private autocompleteApiService: AutocompleteApiService,
    private contactService: ContactService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private contactSearchlistService: ContactSearchlistService,
    private router: Router,
  ) {

  }

  /**
   * Display user menu at the position
   *
   * @action LayoutEventUserMenu
   */
  LayoutEventUserMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventUserMenu>(LayoutEventUserMenu.TYPE),
    map(action => new RuntimeUpdateContextual({
      contextual: {
        uid: 'user-menu',
        position: action.payload.position,
      },
    })),
  ));

  /**
   * Perform operations based on operation ID
   *
   * @action LayoutEventOperation
   */
  LayoutEventOperation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventOperation>(LayoutEventOperation.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      // User profile
      if (action.payload.operation === OperationEnum.userProfile) {

        this.router.navigate(['/user']);

        return [];
      }

      // User switch
      if (action.payload.operation === OperationEnum.userSwitch) {

        return [

          // Update sidenav
          new LayoutUpdateSidenav({
            sidenav: {
              uid: 'user-switch',
              isLoading: false,
            },
          }),
        ];
      }

      // Online help
      if (action.payload.operation === OperationEnum.userHelp) {

        this.router.navigate(['/help']);

        return [];
      }

      // Suggestion
      if (action.payload.operation === OperationEnum.suggestionList) {

        this.router.navigate(['/suggestion']);

        return [];
      }

      // Signout
      if (action.payload.operation === OperationEnum.userSignout) {

        this.browserService.redirect('/index/logout');

        return [];
      }

      return [];
    }),
  ));

  /**
   * Toggle header search
   *
   * @action LayoutEventToggleSearch
   */
  LayoutEventToggleSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventToggleSearch>(LayoutEventToggleSearch.TYPE),
    switchMap(action => zip(
      of(action),
      this.layoutService.selectHeaderSearch(),
    )),
    switchMap(([action, search]) => {

      const actions = [];

      if (action.payload.isActive === true && search.query.length >= 2) {

        // Update sidenav
        actions.push(
          new LayoutUpdateSidenav({
            sidenav: {
              uid: 'search',
              isLoading: true,
            },
          }),
        );
      }

      // Update search
      actions.push(
        new LayoutUpdateSearch({
          search: {
            ...search,
            isActive: action.payload.isActive,
          },
        }),
      );

      return actions;
    }),
  ));

  /**
   * Perform API call to fetch search results
   *
   * @action LayoutEventSearch
   */
  LayoutEventSearch$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventSearch>(LayoutEventSearch.TYPE),
    debounceTime(250),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectPermissions(),
      this.layoutService.selectHeaderSearch(),
    )),
    switchMap(([action, permissions, search]) => {

      // Cleared search query
      if (action.payload.query.length === 0) {

        return [

          // Update search
          new LayoutUpdateSearch({
            search: {
              ...initialState.search,
              isActive: true,
            },
          }),
        ];
      }

      // Prevent API calls for search queries shorter than 3 characters
      if (action.payload.query.length < 3) {

        return [

          // Update search query
          new LayoutUpdateSearch({
            search: {
              ...search,
              query: action.payload.query,
            },
          }),
        ];
      }

      let newSearch = { ...search };

      // Set entities as loading
      Object.keys(newSearch.entities).forEach(key => {

        newSearch = {
          ...newSearch,
          entities: {
            ...newSearch.entities,
            [key]: {
              ...newSearch.entities[key],
              isLoading: true,
            },
          },
        };
      });

      const actions: Action[] = [

        // Update search
        new LayoutUpdateSearch({
          search: {
            ...newSearch,
            query: action.payload.query,
          },
        }),

        // Update sidenav
        new LayoutUpdateSidenav({
          sidenav: {
            uid: 'search',
            isLoading: true,
          },
        }),
      ];

      // Has permission: contact read
      if (permissions.indexOf(PermissionEnum.contactRead) > -1) {

        actions.push(

          // Search contact
          new LayoutEventSearchEntity({
            entity: EntityEnum.contact,
            query: action.payload.query,
          }),
        );
      }

      // Has permission: property read
      if (permissions.indexOf(PermissionEnum.propertyRead) > -1) {

        actions.push(

          // Search property
          new LayoutEventSearchEntity({
            entity: EntityEnum.property,
            query: action.payload.query,
          }),
        );
      }

      // Has permission: promotion read
      if (permissions.indexOf(PermissionEnum.promotionRead) > -1) {

        actions.push(

          // Search promotion
          new LayoutEventSearchEntity({
            entity: EntityEnum.promotion,
            query: action.payload.query,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to fetch contacts
   *
   * @action LayoutEventSearchEntity entity === EntityEnum.contact
   */
  LayoutEventSearchContact$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventSearchEntity>(LayoutEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.contact),
    switchMap(action => zip(
      of(action),
      this.contactSearchlistService.selectSearchDefault(),
      this.runtimeService.selectAuthentication(),
    )),
    switchMap(([action, listSearchDefault, authentication]) => {

      const filters = new ContactSearchModel();
      filters.mode = ListTypeEnum.contact;
      filters.circle = authentication.isMultiAgency ? 'circle_group' : 'circle_agency';
      filters.isArchive01 = '0';
      filters.contactTextSearch = action.payload.query;

      return this.listContacts(
        { page: 1, perPage: 4 },
        listSearchDefault.sort,
        filters,
      );
    }),
  ));

  /**
   * Perform API call to fetch properties
   *
   * @action LayoutEventSearchEntity entity === EntityEnum.property
   */
  LayoutEventSearchProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventSearchEntity>(LayoutEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.property),
    switchMap(action => {

      const autocompleteSearch: AutocompleteSearchInterface = {
        entities: [EntityEnum.property],
        query: action.payload.query,
        archived: false,
        limit: 4,
      };

      // API call
      return this
        .autocompleteApiService
        .search(autocompleteSearch)
        .pipe(
          withLatestFrom(
            this.layoutService.selectHeaderSearch(),
          ),

          // Success
          switchMap(([suggestions, latestSearch]) => {

            const options = suggestions.find(suggestion => suggestion.entity === EntityEnum.property).options;

            if (options.length === 0) {

              return [

                // Update search
                new LayoutUpdateSearch({
                  search: {
                    ...latestSearch,
                    entities: {
                      ...latestSearch.entities,
                      property: {
                        isLoading: false,
                        ids: [],
                      },
                    },
                  },
                }),
              ];
            }

            const propertyFilters = new PropertySearchModel();
            propertyFilters.ids = options.map(opt => opt.value);

            return this.listProperties(
              { page: 1, perPage: 4 },
              { id: 'reference', order: OrderEnum.asc },
              propertyFilters,
            );
          }),

          // Error
          catchError(([error, latestSearch]) => [

            // Broadcast error
            new RuntimeEventError({ id: '43', error: error }),

            // Update search
            new LayoutUpdateSearch({
              search: {
                ...latestSearch,
                entities: {
                  ...latestSearch.entities,
                  property: {
                    isLoading: false,
                    ids: [],
                  },
                },
              },
            }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to fetch promotions
   *
   * @action LayoutEventSearchEntity entity === EntityEnum.promotion
   */
  LayoutEventSearchPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LayoutEventSearchEntity>(LayoutEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.promotion),
    switchMap(action => {

      const autocompleteSearch: AutocompleteSearchInterface = {
        entities: [EntityEnum.promotion],
        query: action.payload.query,
        archived: false,
        limit: 4,
      };

      // API call
      return this
        .autocompleteApiService
        .search(autocompleteSearch)
        .pipe(
          withLatestFrom(
            this.layoutService.selectHeaderSearch(),
          ),

          // Success
          switchMap(([suggestions, latestSearch]) => {

            const options = suggestions.find(suggestion => suggestion.entity === EntityEnum.promotion).options;

            if (options.length === 0) {

              return [

                // Update search
                new LayoutUpdateSearch({
                  search: {
                    ...latestSearch,
                    entities: {
                      ...latestSearch.entities,
                      promotion: {
                        isLoading: false,
                        ids: [],
                      },
                    },
                  },
                }),
              ];
            }

            const promotionFilters = new PromotionSearchModel();
            promotionFilters.promotionIds = options.map(opt => opt.value);
            promotionFilters.isArchive01 = '0';

            return this.listPromotions(
              { page: 1, perPage: 4 },
              { id: 'name', order: OrderEnum.asc },
              promotionFilters,
            );
          }),

          // Error
          catchError(([error, latestSearch]) => [

            // Broadcast error
            new RuntimeEventError({ id: '44', error: error }),

            // Update search
            new LayoutUpdateSearch({
              search: {
                ...latestSearch,
                entities: {
                  ...latestSearch.entities,
                  promotion: {
                    isLoading: false,
                    ids: [],
                  },
                },
              },
            }),
          ]),
        );
    }),
  ));

  /**
   * Update layout search contacts
   */
  private listContacts(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): Observable<Action> {

    // API call
    return this
      .contactService
      .list(pagination, sort, filters)
      .pipe(
        withLatestFrom(
          this.layoutService.selectHeaderSearch(),
        ),

        // Success
        switchMap(([list, latestSearch]) => [

          // Update search
          new LayoutUpdateSearch({
            search: {
              ...latestSearch,
              entities: {
                ...latestSearch.entities,
                contact: {
                  isLoading: false,
                  ids: list.models.map(model => model.id),
                },
              },
            },
          }),

          // Upsert contacts
          new ContactUpsert({
            models: list.models,
          }),
        ]),

        // Error
        catchError(([error, latestSearch]) => [

          // Broadcast error
          new RuntimeEventError({ id: '45', error: error }),

          // Update search
          new LayoutUpdateSearch({
            search: {
              ...latestSearch,
              entities: {
                ...latestSearch.entities,
                contact: {
                  isLoading: false,
                  ids: [],
                },
              },
            },
          }),
        ]),
      );
  }

  /**
   * Update layout search properties
   */
  private listProperties(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PropertySearchModel,
  ): Observable<Action> {

    return this
      .propertyService
      .list(pagination, sort, filters)
      .pipe(
        withLatestFrom(
          this.layoutService.selectHeaderSearch(),
        ),

        // Success
        switchMap(([list, latestSearch]) => {

          return [

            // Update search
            new LayoutUpdateSearch({
              search: {
                ...latestSearch,
                entities: {
                  ...latestSearch.entities,
                  property: {
                    isLoading: false,
                    ids: list.models.map(model => model.id),
                  },
                },
              },
            }),

            // Upsert properties
            new PropertyUpsert({
              models: list.models,
            }),
          ];
        }),

        // Error
        catchError(([error, latestSearch]) => [

          // Broadcast error
          new RuntimeEventError({ id: '46', error: error }),

          // Update search
          new LayoutUpdateSearch({
            search: {
              ...latestSearch,
              entities: {
                ...latestSearch.entities,
                property: {
                  isLoading: false,
                  ids: [],
                },
              },
            },
          }),
        ]),
      );
  }

  /**
   * Update layout search promotions
   */
  private listPromotions(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PromotionSearchModel,
  ): Observable<Action> {

    return this
      .promotionService
      .list(pagination, sort, filters)
      .pipe(
        withLatestFrom(
          this.layoutService.selectHeaderSearch(),
        ),

        // Success
        switchMap(([list, latestSearch]) => {

          return [

            // Update search
            new LayoutUpdateSearch({
              search: {
                ...latestSearch,
                entities: {
                  ...latestSearch.entities,
                  promotion: {
                    isLoading: false,
                    ids: list.models.map(model => model.id),
                  },
                },
              },
            }),

            // Upsert promotions
            new PromotionUpsert({
              models: list.models,
            }),
          ];
        }),

        // Error
        catchError(([error, latestSearch]) => [

          // Broadcast error
          new RuntimeEventError({ id: '47', error: error }),

          // Update search
          new LayoutUpdateSearch({
            search: {
              ...latestSearch,
              entities: {
                ...latestSearch.entities,
                promotion: {
                  isLoading: false,
                  ids: [],
                },
              },
            },
          }),
        ]),
      );
  }
}
