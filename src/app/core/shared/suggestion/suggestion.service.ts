import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';

import { SuggestionConfig } from './suggestion.config';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { SuggestionSearchModel } from '../../../shared/model/suggestion-search.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { SuggestionApiService } from '../../../api/shared/suggestion/suggestion-api.service';
import { SuggestionEventRemove } from '../../../core-store/ui-suggestion/actions/suggestion-event-remove';
import { selectDataSuggestion } from '../../../core-store/data-suggestion/selectors';
import { SuggestionVoteModel } from '../../../shared/model/suggestion-vote.model';
import { SuggestionEventVote } from '../../../core-store/ui-suggestion/actions/suggestion-event-vote';

@Injectable()
export class SuggestionService extends ModelServiceAbstract<SuggestionModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private moduleConfig: SuggestionConfig,
    private suggestionApiService: SuggestionApiService,
    private legacyParserService: LegacyParserService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): SuggestionModel {

    return new SuggestionModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<SuggestionModel|null> {

    return this.store$.select(selectDataSuggestion(id));
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<SuggestionModel> {

    return this
      .suggestionApiService
      .load(id);
  }

  /**
   * @inheritDoc
   */
  save(model: SuggestionModel): Observable<ModelSaveInterface> {

    return this
      .suggestionApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: SuggestionSearchModel,
  ): Observable<ModelListInterface<SuggestionModel>> {

    return this.suggestionApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  remove(id: string): void {

    this.store$.dispatch(
      new SuggestionEventRemove({ id: id }),
    );
  }

  /**
   * List suggestion votes
   */
  listVote(suggestionId: string): Observable<SuggestionVoteModel[]> {

    return this.suggestionApiService.listVote(suggestionId);
  }

  /**
   * Save suggestion vote
   */
  saveVote(suggestionId: string, vote: SuggestionVoteModel): void {

    this.store$.dispatch(
      new SuggestionEventVote({
        suggestionId: suggestionId,
        vote: vote,
      }),
    );
  }
}
