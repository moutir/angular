import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../core-store/state.interface';
import { AutocompleteSuggestionInterface } from '../../shared/interface/autocomplete-suggestion.interface';
import { selectUiIsLoading, selectUiSuggestions } from '../../core-store/ui-autocomplete/selectors';
import { AutocompleteSearchInterface } from '../../shared/interface/autocomplete-search.interface';
import { AutocompleteEventSearch } from '../../core-store/ui-autocomplete/actions/autocomplete-event-search';
import { AutocompleteSet } from '../../core-store/ui-autocomplete/actions/autocomplete-set';

@Injectable()
export class AutocompleteService {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
  ) {

  }

  /**
   * Select suggestions
   */
  selectSuggestions(uid: string): Observable<AutocompleteSuggestionInterface[]> {

    return this.store$.select(selectUiSuggestions(uid));
  }

  /**
   * Select UI is loading
   */
  selectIsLoading(uid: string): Observable<boolean> {

    return this.store$.select(selectUiIsLoading(uid));
  }

  /**
   * Register a new autocomplete
   */
  register(uid: string, search: AutocompleteSearchInterface): void {

    this.store$.dispatch(
      new AutocompleteSet({
        uid: uid,
        autocomplete: {
          hash: '',
          search: search,
          isLoading: false,
        },
      }),
    );
  }

  /**
   * Unregister autocomplete
   */
  unregister(uid: string): void {

    this.store$.dispatch(
      new AutocompleteSet({
        uid,
        autocomplete: null,
      }),
    );
  }

  /**
   * Perform autocomplete search query
   */
  searchQuery(uid: string, search: AutocompleteSearchInterface): void {

    // Prevent search queries shorter than 2 characters
    if (search.query.length <= 2) {

      return;
    }

    this.store$.dispatch(
      new AutocompleteEventSearch({
        uid,
        search,
      }),
    );
  }
}
