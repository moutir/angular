import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';

import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { SuggestionListRequestInterface } from './suggestion-list-request.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { SuggestionSearchModel } from '../../../shared/model/suggestion-search.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LegacySuggestionDataInterface } from '../../format/legacy/data/legacy-suggestion-data.interface';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { SuggestionVoteModel } from '../../../shared/model/suggestion-vote.model';
import { SuggestionListVoteRequestInterface } from './suggestion-list-vote-request.interface';
import { LegacySuggestionVoteDataInterface } from '../../format/legacy/data/legacy-suggestion-vote-data.interface';
import { LegacySuggestionHydrator } from '../../format/legacy/data/legacy-suggestion.hydrator';

@Injectable()
export class SuggestionApiService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private legacySuggestionHydrator: LegacySuggestionHydrator,
  ) {

    super();
  }

  /**
   * List suggestions
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: SuggestionSearchModel,
  ): Observable<ModelListInterface<SuggestionModel>> {

    const request = <SuggestionListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.statusIds && filters.statusIds.length > 0) {

      request.status_ids = filters.statusIds;
    }

    if (filters.tagIds && filters.tagIds.length > 0) {

      request.tag_ids = filters.tagIds;
    }

    return this
      .httpService
      .get<SuggestionListRequestInterface, LegacyListResponseInterface<LegacySuggestionDataInterface>>(
        ApiEndpointEnum.suggestionList,
        request,
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacySuggestionHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Load suggestion
   */
  load(id: string): Observable<SuggestionModel> {

    return this
      .httpService
      .get<{}, LegacySuggestionDataInterface>(
        ApiEndpointEnum.suggestionLoad,
        null,
        { id: id },
        true,
      ).pipe(
        map(response => this.legacySuggestionHydrator.hydrateModel(response)),
      );
  }

  /**
   * Save suggestion
   */
  save(model: SuggestionModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<{ payload: string; }, LegacySaveResponseInterface>(
        ApiEndpointEnum.suggestionSave,
        {
          payload: JSON.stringify(this.legacySuggestionHydrator.hydrateData(model)),
        },
        null,
        true,
      );
  }

  /**
   * Remove suggestion
   */
  remove(id: string): Observable<boolean> {

    return this
      .httpService
      .delete<HttpRequest<void>, { success: boolean; }>(ApiEndpointEnum.suggestionDelete, null, { id })
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * List suggestion votes
   */
  listVote(suggestionId: string): Observable<SuggestionVoteModel[]> {

    return this
      .httpService
      .get<SuggestionListVoteRequestInterface, LegacyListResponseInterface<LegacySuggestionVoteDataInterface>>(
        ApiEndpointEnum.suggestionListVote,
        null,
        {
          id: suggestionId,
        },
        true,
      )
      .pipe(
        map(response => response.data.map(data => this.legacySuggestionHydrator.hydrateModelVote(data))),
      );
  }

  /**
   * Save suggestion vote
   */
  saveVote(suggestionId: string, vote: SuggestionVoteModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<{ payload: string; }, LegacySaveResponseInterface>(
        ApiEndpointEnum.suggestionSaveVote,
        {
          payload: JSON.stringify(this.legacySuggestionHydrator.hydrateDataVote(vote)),
        },
        {
          id: suggestionId,
        },
        true,
      );
  }
}
