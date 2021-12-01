import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { MatchingModel } from '../../../shared/model/matching.model';
import { MatchingSearchModel } from '../../../shared/model/matching-search.model';
import { MatchingSearchOptionsInterface } from '../../../shared/interface/matching-search-options.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataMatchings } from '../../../core-store/data-matching/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { HelperService } from '../helper.service';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { MatchingConfig } from './matching.config';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';
import { SearchlistSearchInterface } from '../../../shared/interface/searchlist-search.interface';

@Injectable()
export class MatchingSearchlistService extends SearchlistServiceAbstract<
  MatchingModel,
  MatchingSearchModel,
  MatchingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MatchingConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
    protected helperService: HelperService,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): MatchingSearchModel {

    return new MatchingSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      this.getSelectorModelsSelected(uid),
      (
        matchings: MatchingModel[] | null,
      ): MenuInterface => {

        return {
          items: [{
            id: OperationEnum.matchingWaiting,
            label: 'label_reset_as_pending',
            isEnabled: (matchings || []).length > 0,
            icon: 'update',
            tooltip: '',
            items: [],
          }],
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, MatchingSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ): MatchingSearchOptionsInterface => {

        const filters = {
          propertyId: [],
          dateFrom: [],
          dateTo: [],
          statusId: options.matchingStatus,
          brokerId: options.brokerByAgency,
          searchManagerIds: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
        };

        return filters;
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
        formOptions: MatchingSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof MatchingSearchOptionsInterface;
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
          statusId: {
            translation: 'keyword_status',
            option: 'statusId',
            isRemovable: true,
          },
          searchManagerIds: {
            translation: 'keyword_contact_search_manager',
            option: 'searchManagerIds',
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

            // Property ID
            if (keyword.name === 'propertyId') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Contact ID
            if (keyword.name === 'contactId') {

              updatedKeyword.translation = 'keyword_contact';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Property broker ID
            if (keyword.name === 'propertyBrokerId') {

              updatedKeyword.translation = 'keyword_broker_for_property';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

              return updatedKeyword;
            }

            // Contact broker ID
            if (keyword.name === 'contactBrokerId') {

              updatedKeyword.translation = 'keyword_broker_for_contact';
              updatedKeyword.isRemovable = true;

              formOptions.brokerId
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

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
  protected selectDefaultFilters(): Observable<MatchingSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'process_date',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<MatchingModel> {

    return selectDataMatchings;
  }

  /**
   * @inheritDoc
   */
  protected getSearchPreference(uid: string, userPreference: RuntimeUserPreferenceInterface): SearchlistSearchInterface {

    const searchPreference = super.getSearchPreference(uid, userPreference);

    // [CRM-2605] Remove statusId 229 that is no longer supported but that might have been saved
    if (searchPreference.filters && searchPreference.filters['statusId'] === '229') {

      searchPreference.filters['statusId'] = null;
    }

    return searchPreference;
  }
}
