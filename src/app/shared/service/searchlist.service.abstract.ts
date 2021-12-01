import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import { NgZone } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  getUid,
  selectUiCache,
  selectUiForm,
  selectUiHash,
  selectUiIsFormAdvanced,
  selectUiOperation,
  selectUiSearch,
  selectUiSearchFilters,
  selectUiSearchlist,
  selectUiSearchPagination,
  selectUiSearchSort,
  selectUiSelection,
  selectUiState,
  selectUiTotal,
} from '../../core-store/ui-searchlist/selectors';
import { SearchlistEventChangeInput } from '../../core-store/ui-searchlist/actions/searchlist-event-change-input';
import { ListSelectionTypeEnum } from '../enum/list-selection-type.enum';
import { SearchlistEventRemoveKeyword } from '../../core-store/ui-searchlist/actions/searchlist-event-remove-keyword';
import { SearchlistEventChangeSelectionModel } from '../../core-store/ui-searchlist/actions/searchlist-event-change-selection-model';
import { InputFormInterface } from '../interface/input-form.interface';
import { ListSelectionInterface } from '../interface/list-selection.interface';
import { ModelAbstract } from '../class/model.abstract';
import { PaginationInterface } from '../interface/pagination.interface';
import { SortInterface } from '../interface/sort.interface';
import { ListFiltersInterface } from '../interface/list-filters.interface';
import { StateInterface } from '../../core-store/state.interface';
import { SearchlistSet } from '../../core-store/ui-searchlist/actions/searchlist-set';
import { KeywordInterface } from '../interface/keyword.interface';
import { SearchlistEventOperation } from '../../core-store/ui-searchlist/actions/searchlist-event-operation';
import { selectUiOperationIds } from '../../core-store/ui-entity/selectors';
import { SearchlistSearchInterface } from '../interface/searchlist-search.interface';
import { MenuInterface } from '../interface/menu.interface';
import { SearchlistEventPagination } from '../../core-store/ui-searchlist/actions/searchlist-event-pagination';
import { SearchOptionsInterface } from '../interface/search-options.interface';
import { SearchlistEventContextMenu } from '../../core-store/ui-searchlist/actions/searchlist-event-context-menu';
import { SearchlistEventReset } from '../../core-store/ui-searchlist/actions/searchlist-event-reset';
import { SearchlistEventSort } from '../../core-store/ui-searchlist/actions/searchlist-event-sort';
import { SearchlistEventToggleForm } from '../../core-store/ui-searchlist/actions/searchlist-event-toggle-form';
import { SearchlistEventChangeSelectionType } from '../../core-store/ui-searchlist/actions/searchlist-event-change-selection-type';
import { SearchlistEventReload } from '../../core-store/ui-searchlist/actions/searchlist-event-reload';
import { SearchlistEventSubmitByRoute } from '../../core-store/ui-searchlist/actions/searchlist-event-submit-by-route';
import { SearchlistEventSubmitByForm } from '../../core-store/ui-searchlist/actions/searchlist-event-submit-by-form';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { OrderEnum } from '../enum/order.enum';
import { SearchlistEventSubmitByTab } from '../../core-store/ui-searchlist/actions/searchlist-event-submit-by-tab';
import { SearchlistEventSaveParams } from '../../core-store/ui-searchlist/actions/searchlist-event-save-params';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistEventSubmitByFilters } from '../../core-store/ui-searchlist/actions/searchlist-event-submit-by-filters';
import { Dictionary } from '../../shared/class/dictionary';
import { DataSearchlistInterface } from '../../core-store/data-searchlist/data-searchlist.interface';
import { ModuleConfig } from '../class/module-config';
import { SearchlistInterface } from '../interface/searchlist.interface';
import { UiSearchlistStateInterface } from '../../core-store/ui-searchlist/state';
import { RuntimeUserPreferenceInterface } from '../interface/runtime-user-preference.interface';
import { EntityEnum } from '../enum/entity.enum';
import { SearchlistEventSubmitBySearch } from '../../core-store/ui-searchlist/actions/searchlist-event-submit-by-search';

export abstract class SearchlistServiceAbstract<
  Model extends ModelAbstract,
  Filters extends ListFiltersInterface,
  Options extends SearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ModuleConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
  ) {

  }

  /**
   * Return empty searchlist filters
   */
  abstract getEmptyFilters(): Filters;

  /**
   * Return the page service entity
   */
  getEntity(): EntityEnum {

    return this.moduleConfig.ENTITY;
  }

  /**
   * Select route search
   */
  selectSearchRoute(queryParams: Params): Observable<SearchlistSearchInterface> {

    return of({
      filters: this.getRouteFilters(queryParams),
      sort: this.getRouteSort(queryParams),
      pagination: this.getRoutePagination(queryParams),
    });
  }

  /**
   * Select preference search
   */
  selectSearchPreference(uid: string): Observable<SearchlistSearchInterface> {

    return this
      .runtimeService
      .selectUserPreference()
      .pipe(
        map(userPreference => this.getSearchPreference(uid, userPreference)),
      );
  }

  /**
   * Select default search
   */
  selectSearchDefault(): Observable<SearchlistSearchInterface> {

    return combineLatest<Observable<Filters>, Observable<SortInterface>, Observable<PaginationInterface>>([
      this.selectDefaultFilters(),
      this.selectDefaultSort(),
      this.selectDefaultPagination(),
    ])
    .pipe(
      map(values => {

        return {
          filters: values[0],
          sort: values[1],
          pagination: values[2],
        };
      }),
    );
  }

  /**
   * Select models
   */
  selectModels(uid: string): Observable<Model[]|null> {

    return this.store$.select(this.getSelectorModels(uid));
  }

  /**
   * Select selected models
   */
  selectModelsSelected(uid: string): Observable<Model[]> {

    return this.store$.select(this.getSelectorModelsSelected(uid));
  }

  /**
   * Select selectable models
   */
  selectModelsSelectable(uid: string): Observable<Model[]> {

    return this.store$.select(this.getSelectorModelsSelectable(uid))
      .pipe(
        map(models => models || []),
      );
  }

  /**
   * Select pagination
   */
  selectPagination(uid: string): Observable<PaginationInterface> {

    return this.store$.select(selectUiSearchPagination(uid));
  }

  /**
   * Select sort
   */
  selectSort(uid: string): Observable<SortInterface> {

    return this.store$.select(selectUiSearchSort(uid));
  }

  /**
   * Select total
   */
  selectTotal(uid: string): Observable<number> {

    return this.store$.select(selectUiTotal(uid));
  }

  /**
   * Select form
   */
  selectForm(uid: string): Observable<Filters> {

    return <Observable<Filters>>this.store$.select(selectUiForm(uid));
  }

  /**
   * Select form options
   */
  selectFormOptions(uid: string): Observable<Options> {

    return this.store$.select(this.getSelectorFormOptions(uid));
  }

  /**
   * Select search
   */
  selectSearch(uid: string): Observable<SearchlistSearchInterface> {

    return this.store$.select(selectUiSearch(uid));
  }

  /**
   * Select filters
   */
  selectFilters(uid: string): Observable<Filters> {

    return <Observable<Filters>>this.store$.select(selectUiSearchFilters(uid));
  }

  /**
   * Select selection
   */
  selectSelection(uid: string): Observable<ListSelectionInterface> {

    return this.store$.select(selectUiSelection(uid));
  }

  /**
   * Select if all the selectable models of the current page are selected
   */
  selectIsSelectedPage(uid: string): Observable<boolean> {

    return this.store$.select(createSelector(
      selectUiSelection(uid),
      this.getSelectorModelsSelectable(uid),
      (selection: ListSelectionInterface, modelsSelectable: Model[]|null): boolean => {

        // Are all the models of the page the only selected IDs ?
        return modelsSelectable !== null &&
          modelsSelectable.length > 0 &&
          selection.ids.length > 0 &&
          modelsSelectable.every(model => selection.ids.indexOf(model.id) > -1);
      },
    ));
  }

  /**
   * Select keywords
   */
  selectKeywords(uid: string): Observable<KeywordInterface[]> {

    return this.store$.select(this.getSelectorKeywords(uid));
  }

  /**
   * Select menu operation
   */
  selectMenuOperation(uid: string): Observable<MenuInterface> {

    return this.store$.select(this.getSelectorMenuOperation(uid));
  }

  /**
   * Select operation
   */
  selectOperation(uid: string): Observable<string> {

    return this.store$.select(selectUiOperation(uid));
  }

  /**
   * Select operation IDs
   */
  selectOperationIds(): Observable<string[]> {

    return this.store$.select(selectUiOperationIds(this.moduleConfig.ENTITY));
  }

  /**
   * Select is form advanced
   */
  selectIsFormAdvanced(uid: string): Observable<boolean> {

    return this.store$.select(selectUiIsFormAdvanced(uid));
  }

  /**
   * Select searchlist
   */
  selectSearchlist(uid: string): Observable<SearchlistInterface> {

    return this.store$.select(selectUiSearchlist(uid));
  }

  /**
   * Select state
   */
  selectState(): Observable<UiSearchlistStateInterface> {

    return this.store$.select(selectUiState);
    
  }

  /**
   * Update sort
   */
  updateSort(uid: string, sort: SortInterface): void {

    // Stats
    this.trackerService.trackSort(this.moduleConfig.ENTITY + '-list-sort', sort.id, sort.order);

    this.store$.dispatch(
      new SearchlistEventSort({
        uid,
        sort,
      }),
    );
  }

  /**
   * Update pagination
   */
  updatePagination(uid: string, pagination: PaginationInterface): void {

    // Stats
    this.trackerService.trackString(this.moduleConfig.ENTITY + '-list-pagination', [pagination.page, pagination.perPage].join('-'));

    this.store$.dispatch(
      new SearchlistEventPagination({
        uid,
        pagination,
      }),
    );
  }

  /**
   * Update form
   */
  updateForm(uid: string, input: InputFormInterface, model: Model): void {

    this.store$.dispatch(
      new SearchlistEventChangeInput({
        uid,
        input,
        model,
      }),
      
    );
    //console.log(uid,input,model)
  }

  /**
   * Update selection model
   */
  updateSelectionModel(uid: string, isSelected: boolean, model: Model): void {

    this.store$.dispatch(
      new SearchlistEventChangeSelectionModel({
        uid,
        isSelected,
        model,
      }),
    );
  }

  /**
   * Update selection type
   */
  updateSelectionType(uid: string, type: ListSelectionTypeEnum): void {

    this.store$.dispatch(
      new SearchlistEventChangeSelectionType({
        uid,
        type,
      }),
    );
  }

  /**
   * Toggle form advanced mode
   */
  toggleForm(uid: string): void {

    this.store$.dispatch(
      new SearchlistEventToggleForm({ uid }),
    );
  }

  /**
   * Remove keyword
   */
  removeKeyword(uid: string, keyword: KeywordInterface): void {

    // Stats
    this.trackerService.trackStringPair(this.moduleConfig.ENTITY + '-filter-change', keyword.name, '');

    this.store$.dispatch(
      new SearchlistEventRemoveKeyword({
        uid,
        keyword,
      }),
    );
  }

  /**
   * Launch operation on IDs
   */
  operation(uid: string, operation: string, ids?: string[]): void {

    this.store$.dispatch(
      new SearchlistEventOperation({
        uid,
        operation,
        ids,
      }),
    );
  }

  /**
   * Return UID based on provided name
   */
  getUid(name: string): string {

    return getUid(this.moduleConfig.ENTITY, name);
  }

  /**
   * Register searchlist and returns a UID
   */
  register(name: string): string {

    const uid = this.getUid(name);

    const filters = this.getEmptyFilters();

    this.store$.dispatch(
      new SearchlistSet({
        uid,
        searchlist: {
          selection: {
            isSelectedAll: false,
            ids: [],
            isLoading: false,
          },
          search: {
            filters: filters,
            pagination: {
              page: null,
              perPage: null,
            },
            sort: {
              id: null,
              order: null,
            },
          },
          form: filters,
          total: 0,
          isLoading: true,
          operation: null,
          isFormAdvanced: false,
        },
      }),
    );

    return uid;
  }

  /**
   * Unregister searchlist UID
   */
  unregister(uid: string): void {

    this.store$.dispatch(
      new SearchlistSet({
        uid,
        searchlist: null,
      }),
    );
  }

  /**
   * Submit searchlist UID with route query params
   */
  submitByRoute(uid: string, queryParams: Params): void {

    this.store$.dispatch(
      new SearchlistEventSubmitByRoute({ uid, queryParams }),
    );
  }

  /**
   * Submit searchlist UID with previous search
   */
  submitBySearch(uid: string): void {

    this.store$.dispatch(
      new SearchlistEventSubmitBySearch({ uid }),
    );
  }

  /**
   * Submit current searchlist UID with a tab name and index
   */
  submitByTab(uid: string, inputName: string, optionIndex: number): void {

    this.store$.dispatch(
      new SearchlistEventSubmitByTab({ uid, inputName, optionIndex }),
    );
  }

  /**
   * Submit searchlist UID with current form
   */
  submitByForm(uid: string): void {

    this.store$.dispatch(
      new SearchlistEventSubmitByForm({ uid }),
    );
  }

  /**
   * Submit searchlist UID with partial filters
   */
  submitByFilters(
    uid: string,
    filters: Partial<Filters>,
    sort: SortInterface = { id: 'id', order: OrderEnum.desc },
    pagination: PaginationInterface = { page: 1, perPage: 10 },
  ): void {

    this.store$.dispatch(
      new SearchlistEventSubmitByFilters({ uid, filters, sort, pagination }),
    );
  }

  /**
   * Track submitted filters
   */
  trackFilters(filters: ListFiltersInterface): void {

    // Stats
    this.trackerService.trackStringList(
      this.moduleConfig.ENTITY + '-filter-search',
      Object.keys(filters).filter(name => filters[name] !== null && filters[name].length > 0),
    );
  }

  /**
   * Reload searchlist UID with current search params, sort and pagination
   */
  reload(uid: string): void {

    // TODO[later]: Remove NgZone usage when app fully done in angular.
    // Run with NgZone otherwise change detection doesn't work if called from outside angular app
    this.ngZone.run(() => {

      this.store$.dispatch(
        new SearchlistEventReload({ uid }),
      );
    });
  }

  /**
   * Context menu
   */
  contextMenu(uid: string, model: Model): void {

    this.store$.dispatch(
      new SearchlistEventContextMenu({
        uid,
        model,
      }),
    );
  }

  /**
   * Reset searchlist with initial filters
   */
  reset(uid: string): void {

    // Stats
    this.trackerService.track(this.moduleConfig.ENTITY + '-filter-reset');

    this.store$.dispatch(
      new SearchlistEventReset({ uid }),
    );
  }

  /**
   * Save current params as default search params
   */
  saveParams(uid: string): void {

    // Stats
    this.trackerService.track(this.moduleConfig.ENTITY + '-filter-save');

    this.store$.dispatch(
      new SearchlistEventSaveParams({ uid }),
    );
  }

  /**
   * Sync the browser's current URL with the search as query params, does not navigate
   *
   * TODO[later] Remove this as well as SearchlistEventPagination and SearchlistEventSort in favor of router.navigate once fully on Angular
   */
  syncUrl(filters: ListFiltersInterface, sort: SortInterface, pagination: PaginationInterface): void {

    const queryParams: Params = {};

    // Filters
    Object
      .keys(filters)
      .filter(key => filters[key] instanceof Array ? filters[key].length > 0 : !!filters[key] === true)
      .forEach(key => {

        if (key === 'page' || key === 'perPage' ||  key === 'sort') {

          console.error('Reserved keyword "', key, '" when syncing URL, please do not use it in a searchlist\'s filters!');
        }

        queryParams[key] = this.getQueryParamFromFilter(key, filters);
      });

    // Sort
    queryParams.sort = (sort.order === OrderEnum.asc ? '+' : '-') + sort.id;

    // Page
    queryParams.page = String(pagination.page);
    queryParams.perPage = String(pagination.perPage);

    // Build query string
    const query = Object
      .keys(queryParams)
      .map(key => [key, queryParams[key]].join('='))
      .join('&');

    // Replace browser URL
    this.location.go(
      this.location.path().split('?')[0],
      query,
    );

    // TODO[nico] If previous URL is exactly `this.location.path()`, replace state (because there was a JS redirection)
  }

  /**
   * Select current hash
   */
  selectCurrentHash(uid: string): Observable<string> {

    return this.store$.select(selectUiHash(uid));
  }

  /**
   * Return searchlist filters based on query params
   */
  protected getRouteFilters(queryParams: Params): Filters|null {

    // No query params at all
    if (Object.keys(queryParams).length === 0) {

      return null;
    }

    const filters = this.getEmptyFilters();
    const paramKeys = Object.keys(queryParams);
    const filterKeys = Object.keys(filters);

    // Every query param is not in the supported filters
    if (paramKeys.every(key => filterKeys.indexOf(key) === -1)) {

      return null;
    }

    // For each supported filter
    Object
      .keys(filters)
      .forEach(key => {

        // Query params have a value for the filter key
        if (queryParams.hasOwnProperty(key) && !!queryParams === true) {

          filters[key] = this.getFilterFromQueryParam(key, queryParams, filters);
        }
      });

    return filters;
  }

  /**
   * Return searchlist sort based on query params
   */
  protected getRouteSort(queryParams: Params): SortInterface|null {

    const regExp = new RegExp(/^[+-][a-z0-9_]+$/gi);

    // Query params "sort" is valid
    if (queryParams.sort && regExp.test(queryParams.sort) === true) {

      return {
        id: queryParams.sort.substr(1),
        order: queryParams.sort[0] === '+' ? OrderEnum.asc : OrderEnum.desc,
      };
    }

    return null;
  }

  /**
   * Return searchlist pagination based on query params
   */
  protected getRoutePagination(queryParams: Params): PaginationInterface|null {

    // Query params "page" and "perPage"
    if (queryParams.page && queryParams.perPage) {

      return {
        page: parseInt(queryParams.page, 10),
        perPage: parseInt(queryParams.perPage, 10),
      };
    }

    return null;
  }

  /**
   * Return a filter as a query param string
   */
  protected getQueryParamFromFilter(key: string, filters: ListFiltersInterface): string {

    // Date
    if (filters[key] instanceof Date) {

      return filters[key].toISOString().split('T')[0];
    }

    return filters[key] instanceof Array ? filters[key].join(',') : String(filters[key]);
  }

  /**
   * Return a query param as a filter
   */
  protected getFilterFromQueryParam(key: string, queryParams: Params, filters: Filters): object {

    // Date value
    if (!!Date.parse(queryParams[key]) && RegExp('/').test(queryParams[key])) {

      return new Date(queryParams[key]);
    }

    return filters[key] instanceof Array ? queryParams[key].split(',') : queryParams[key];
  }

  /**
   * Select default searchlist pagination
   */
  protected selectDefaultPagination(): Observable<PaginationInterface> {

    return of({
      page: 1,
      perPage: 10,
    });
  }

  /**
   * Return a selector of displayed models
   */
  protected getSelectorModels(uid: string): MemoizedSelector<StateInterface, Model[]|null> {

    return createSelector(
      this.selectDataModels(),
      selectUiCache(uid),
      (models: Dictionary<Model>, cache: DataSearchlistInterface|null): Model[]|null => {

        return !cache ? null : cache.ids.map(id => models[id]).filter(model => !!model);
      },
    );
  }

  /**
   * Return a selector of selected models
   */
  protected getSelectorModelsSelected(uid: string): MemoizedSelector<StateInterface, Model[]> {

    return createSelector(
      this.selectDataModels(),
      selectUiSelection(uid),
      (models: Dictionary<Model>, selection: ListSelectionInterface): Model[] => {

        return selection.ids.filter(id => !!models[id]).map(id => models[id]);
      },
    );
  }

  /**
   * Return a selector of selectable models
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, Model[]|null> {

    return this.getSelectorModels(uid);
  }

  /**
   * Return a selector of MenuInterface listing operations available to the selection IDs
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      this.getSelectorModelsSelected(uid),
      (
        matchingGroups: Model[]|null,
      ): MenuInterface => {

        return {
          items: [],
        };
      },
    );
  }

  /**
   * Return search params from user preference
   */
  protected getSearchPreference(uid: string, userPreference: RuntimeUserPreferenceInterface): SearchlistSearchInterface {

    // No user search preference
    if (!userPreference.searchlist[uid]) {

      return {
        filters: null,
        sort: null,
        pagination: null,
      };
    }

    // Override default filters with search preference filters
    return {
      ...userPreference.searchlist[uid],
      filters: {
        ...this.getEmptyFilters(),
        ...userPreference.searchlist[uid].filters,
      },
    };
  }

  /**
   * Return a selector of Options defining the form options
   */
  protected abstract getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, Options>;

  /**
   * Return a selector of KeywordInterface[]
   */
  protected abstract getSelectorKeywords(uid: string): MemoizedSelector<StateInterface, KeywordInterface[]>;

  /**
   * Select a dictionary of models
   */
  protected abstract selectDataModels(): (state: StateInterface) => Dictionary<Model>;

  /**
   * Select default searchlist filters
   */
  protected abstract selectDefaultFilters(): Observable<Filters>;

  /**
   * Select default searchlist sort
   */
  protected abstract selectDefaultSort(): Observable<SortInterface>;
}
