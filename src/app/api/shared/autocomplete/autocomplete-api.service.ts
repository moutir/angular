import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AutocompleteSearchInterface } from '../../../shared/interface/autocomplete-search.interface';
import { AutocompleteSuggestionInterface } from '../../../shared/interface/autocomplete-suggestion.interface';
import { SearchResponseInterface } from './search-response.interface';
import { SearchRequestInterface } from './search-request.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';

@Injectable()
export class AutocompleteApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Return an observable of autocomplete suggestions
   */
  search(search: AutocompleteSearchInterface): Observable<AutocompleteSuggestionInterface[]> {

    return this
      .httpService
      .get<SearchRequestInterface, SearchResponseInterface>(ApiEndpointEnum.autocompleteSearch, this.searchRequest(search));
  }

  /**
   * Handle a search() request parameters and return a SearchRequestInterface
   */
  private searchRequest(search: AutocompleteSearchInterface): SearchRequestInterface {

    const request: SearchRequestInterface = {
      entities: search.entities.join(','),
      query: search.query,
      archived: search.archived ? 1 : 0,
      limit: search.limit,
    };

    if (search.type) {

      request.type = search.type;
    }

    return request;
  }
}
