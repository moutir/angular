import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Dictionary } from 'app/shared/class/dictionary';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataMarketingExpenses } from '../../../core-store/data-marketing-expense/selectors';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MarketingExpenseConfig } from './marketing-expense.config';
import { MarketingExpenseSearchModel } from '../../../shared/model/marketing-expense-search.model';
import { MarketingExpenseSearchOptionsInterface } from '../../../shared/interface/marketing-expense-search-options.interface';

import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';

@Injectable()
export class MarketingExpenseSearchlistService extends SearchlistServiceAbstract<
  MarketingExpenseModel,
  MarketingExpenseSearchModel,
  MarketingExpenseSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MarketingExpenseConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected helperService: HelperService,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): MarketingExpenseSearchModel {

    return new MarketingExpenseSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, MarketingExpenseSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      (
        form: MarketingExpenseSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
      ): MarketingExpenseSearchOptionsInterface => {

        return {
          dateFrom: [],
          dateTo: [],
          category: options.leadSource,
          propertyId: [],
          promotionId: [],
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
        formOptions: MarketingExpenseSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof MarketingExpenseSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          dateFrom: {
            translation: 'keyword_date_from',
            option: 'dateFrom',
            isRemovable: true,
          },
          dateTo: {
            translation: 'keyword_date_to',
            option: 'dateTo',
            isRemovable: true,
          },
          category: {
            translation: 'keyword_type',
            option: 'category',
            isRemovable: true,
          },
          promotionId: {
            translation: 'keyword_type',
            option: 'promotionId',
            isRemovable: true,
          },
          propertyId: {
            translation: 'keyword_type',
            option: 'propertyId',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {
            const updatedKeyword = {
              ...keyword,
            };

            // Dates
            if (keyword.name === 'dateFrom' || keyword.name === 'dateTo') {

              if (keyword.value instanceof Date === false && !Date.parse(String(keyword.value))) {

                return null;
              }

              updatedKeyword.value = this.helperService.dateToString(new Date(keyword.value), DateFormatEnum.switzerland);
              updatedKeyword.label = updatedKeyword.value;
            }

            // Property ID
            if (keyword.name === 'propertyId') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {
                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            if (keyword.name === 'promotionId') {

              updatedKeyword.translation = 'keyword_promotion';

              if (autocompleteOptions.promotion[<string>keyword.value]) {
                updatedKeyword.label = autocompleteOptions.promotion[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

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
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'invoice_date',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<MarketingExpenseModel> {

    return selectDataMarketingExpenses;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<MarketingExpenseSearchModel> {

    return of(this.getEmptyFilters());
  }
}
