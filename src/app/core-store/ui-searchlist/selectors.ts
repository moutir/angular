import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiSearchlistStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { ListFiltersInterface } from '../../shared/interface/list-filters.interface';
import { PaginationInterface } from '../../shared/interface/pagination.interface';
import { SortInterface } from '../../shared/interface/sort.interface';
import { ListSelectionInterface } from '../../shared/interface/list-selection.interface';
import { DataSearchlistInterface } from '../data-searchlist/data-searchlist.interface';
import { selectDataState } from '../data-searchlist/selectors';
import { DataSearchlistStateInterface } from '../data-searchlist/state';
import { SearchlistInterface } from '../../shared/interface/searchlist.interface';
import { SearchlistSearchInterface } from '../../shared/interface/searchlist-search.interface';
import { KeywordInterface } from '../../shared/interface/keyword.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiSearchlistStateInterface>
  = createFeatureSelector<UiSearchlistStateInterface>(FEATURE_NAME);

/**
 * Select searchlist linked to UID
 */
export const selectUiSearchlist = (uid: string): MemoizedSelector<StateInterface, SearchlistInterface> => createSelector(
  selectUiState,
  (state: UiSearchlistStateInterface): SearchlistInterface => state[uid],
);

/**
 * Select the loading state
 */
export const selectUiIsLoading = (uid: string): MemoizedSelector<StateInterface, boolean> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): boolean => searchlist.isLoading,
);

/**
 * Select the search state
 */
export const selectUiSearch = (uid: string): MemoizedSelector<StateInterface, SearchlistSearchInterface> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): SearchlistSearchInterface => searchlist.search,
);

/**
 * Select the search filters
 */
export const selectUiSearchFilters = (uid: string): MemoizedSelector<StateInterface, ListFiltersInterface> => createSelector(
  selectUiSearch(uid),
  (search: SearchlistSearchInterface): ListFiltersInterface => search.filters,
);

/**
 * Select the search pagination
 */
export const selectUiSearchPagination = (uid: string): MemoizedSelector<StateInterface, PaginationInterface> => createSelector(
  selectUiSearch(uid),
  (search: SearchlistSearchInterface): PaginationInterface => search.pagination,
);

/**
 * Select the search sort
 */
export const selectUiSearchSort = (uid: string): MemoizedSelector<StateInterface, SortInterface> => createSelector(
  selectUiSearch(uid),
  (search: SearchlistSearchInterface): SortInterface => search.sort,
);

/**
 * Select total number of matching records
 */
export const selectUiTotal = (uid: string): MemoizedSelector<StateInterface, number> => createSelector(
  selectUiSearchlist(uid),
  selectUiCache(uid),
  (searchlist: SearchlistInterface, cache: DataSearchlistInterface|null): number => searchlist.total || (cache ? cache.total : 0),
);

/**
 * Select the form params
 */
export const selectUiForm = (uid: string): MemoizedSelector<StateInterface, ListFiltersInterface> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): ListFiltersInterface => searchlist.form,
);

/**
 * Select the selection
 */
export const selectUiSelection = (uid: string): MemoizedSelector<StateInterface, ListSelectionInterface> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): ListSelectionInterface => searchlist.selection,
);

/**
 * Select the keywords
 */
export const selectUiKeywords = (uid: string): MemoizedSelector<StateInterface, KeywordInterface[]> => createSelector(
  selectUiSearchFilters(uid),
  selectUiForm(uid),
  (filters: ListFiltersInterface, form: ListFiltersInterface): KeywordInterface[] => {

    const keywords: KeywordInterface[] = [];

    // For each form field
    Object
      .keys(form)
      .forEach(name => {

        // For each field's value that is not empty
        (form[name] instanceof Array ? form[name] : [form[name]])
          .filter(value => value !== '' && value !== null)
          .forEach(value => {

            keywords.push({
              name: name,
              value: value,
              translation: '{{label}}',
              label: value,
              labelKey: '',
              isSynced: filters[name] === value || (filters[name] instanceof Array && filters[name].indexOf(value) > -1),
              isRemovable: true,
            });
          });
      });

    return keywords;
  },
);

/**
 * Select the operation
 */
export const selectUiOperation = (uid: string): MemoizedSelector<StateInterface, string> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): string => searchlist.operation || '',
);

/**
 * Select searchlist hash
 */
export const selectUiHash = (uid: string): MemoizedSelector<StateInterface, string> => createSelector(
  selectUiSearch(uid),
  (search: SearchlistSearchInterface): string => generateHash(uid, search),
);

/**
 * Select cache linked to UID
 */
export const selectUiCache = (uid: string): MemoizedSelector<StateInterface, DataSearchlistInterface|null> => createSelector(
  selectDataState,
  selectUiHash(uid),
  (data: DataSearchlistStateInterface, hash: string): DataSearchlistInterface|null => data[hash] || null,
);

/**
 * Select the form in advanced mode
 */
export const selectUiIsFormAdvanced = (uid: string): MemoizedSelector<StateInterface, boolean> => createSelector(
  selectUiSearchlist(uid),
  (searchlist: SearchlistInterface): boolean => searchlist.isFormAdvanced,
);

/**
 * Return the search hash based on filters, pagination and sort
 */
export const generateHash = (uid: string, search: SearchlistSearchInterface): string => {

  const filters: ListFiltersInterface = {
    id: '',
  };

  // Make sure filters keys are always sorted so that the hash will be the same no matter the filters order
  Object
    .keys(search.filters)
    .sort()
    .forEach(key => filters[key] = search.filters[key]
      );
    
  return [
    getEntity(uid),
    JSON.stringify(filters),
    search.pagination.page,
    search.pagination.perPage,
    search.sort.id,
    search.sort.order,
  ].join('__');
};

/**
 * Return the entity from a UID
 */
export const getEntity = (uid: string): EntityEnum|null => (uid.split(':')[1] as EntityEnum) || null;

/**
 * Return a UID froom an entity and a name
 */
export const getUid = (entity: EntityEnum, name: string): string => ['searchlist', entity, name].join(':');
