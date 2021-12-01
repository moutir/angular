import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { Dictionary } from 'app/shared/class/dictionary';
import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ProcessModel } from '../../../shared/model/process.model';
import { ProcessSearchModel } from '../../../shared/model/process-search.model';
import { selectDataProcesss } from '../../../core-store/data-process/selectors';
import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ProcessConfig } from './process.config';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { ProcessSearchOptionsInterface } from '../../../shared/interface/process-search-options.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';

@Injectable()
export class ProcessSearchlistService extends SearchlistServiceAbstract<
  ProcessModel,
  ProcessSearchModel,
  ProcessSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ProcessConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): ProcessSearchModel {

    return new ProcessSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, ProcessSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      (
        options: RuntimeOptionsInterface,
      ): ProcessSearchOptionsInterface => {

        return {
          processStatusIds: options.processStatusIds,
          processTypeIds: options.processTypeIds,
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
      selectDataAutocompleteOptions,
      (
        keywords: KeywordInterface[],
        formOptions: ProcessSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof ProcessSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          statusId: {
            translation: 'keyword_default_label',
            option: 'processStatusIds',
            isRemovable: true,
          },
          typeId: {
            translation: 'keyword_default_label',
            option: 'processTypeIds',
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

              // Keyword name is mapped to a form option
              updatedKeyword.translation = keywordOptionMapping[keyword.name].translation;

              const label = (<OptionInterface[]>formOptions[keywordOptionMapping[keyword.name].option] || [])
                .find(option => option.value === keyword.value);

              if (label) {

                updatedKeyword.label = label.text;
              }

              updatedKeyword.isRemovable = keywordOptionMapping[keyword.name].isRemovable;

              return updatedKeyword;
            }

            // Agency ID
            if (keyword.name === 'agencyId') {

              updatedKeyword.translation = 'keyword_default_label';

              if (autocompleteOptions.agency[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.agency[<string>keyword.value].text;
              }

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
  protected selectDefaultFilters(): Observable<ProcessSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'start',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<ProcessModel> {

    return selectDataProcesss;
  }
}
