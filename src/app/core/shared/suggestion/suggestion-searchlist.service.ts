import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { SuggestionSearchOptionsInterface } from '../../../shared/interface/suggestion-search-options.interface';
import { SuggestionSearchModel } from '../../../shared/model/suggestion-search.model';
import { selectDataSuggestions } from '../../../core-store/data-suggestion/selectors';
import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SuggestionConfig } from './suggestion.config';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';

@Injectable()
export class SuggestionSearchlistService extends SearchlistServiceAbstract<
  SuggestionModel,
  SuggestionSearchModel,
  SuggestionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: SuggestionConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
    private translateService: TranslateService,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): SuggestionSearchModel {

    return new SuggestionSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, SuggestionSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      (
        options: RuntimeOptionsInterface,
      ): SuggestionSearchOptionsInterface => {

        return {
          suggestionStatusIds: options.suggestionStatusIds,
          suggestionTagIds: options.suggestionTagIds,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorKeywords(uid: string): MemoizedSelector<StateInterface, KeywordInterface[]> {

    return createSelector(
      selectUiKeywords(uid),
      this.getSelectorFormOptions(uid),
      (
        keywords: KeywordInterface[],
        formOptions: SuggestionSearchOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof SuggestionSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          tagIds: {
            translation: 'keyword_suggestion_tag',
            option: 'suggestionTagIds',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Keyword name is mapped to a form option
            if (keywordOptionMapping[keyword.name]) {

              updatedKeyword.translation = keywordOptionMapping[keyword.name].translation;

              const label = (<OptionInterface[]>formOptions[keywordOptionMapping[keyword.name].option] || [])
                .find(option => option.value === keyword.value);

              if (label) {

                updatedKeyword.label = label.text;
              }

              updatedKeyword.isRemovable = keywordOptionMapping[keyword.name].isRemovable;

              return updatedKeyword;
            }

            // Status
            if (keyword.name === 'statusIds') {

              updatedKeyword.translation = 'keyword_suggestion_status';
              updatedKeyword.label = this.translateService.instant('suggestion_status_' + keyword.value);
              updatedKeyword.isRemovable = true;

              return updatedKeyword;
            }

            return updatedKeyword;
          })
          .filter(keyword => keyword !== null)
          .sort((a, b) => {

            const aScore = (a.isRemovable ? 1 : 0);
            const bScore = (b.isRemovable ? 1 : 0);

            return aScore !== bScore ? aScore - bScore : a.name.localeCompare(b.name);
          });
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<SuggestionSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'pertinence',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<SuggestionModel> {

    return selectDataSuggestions;
  }
}
