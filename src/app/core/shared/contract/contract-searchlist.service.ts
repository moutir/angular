import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ContractModel } from '../../../shared/model/contract.model';
import { ContractSearchOptionsInterface } from '../../../shared/interface/contract-search-options.interface';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { selectDataContracts } from '../../../core-store/data-contract/selectors';
import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContractConfig } from './contract.config';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { HelperService } from '../helper.service';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class ContractSearchlistService extends SearchlistServiceAbstract<
  ContractModel,
  ContractSearchModel,
  ContractSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ContractConfig,
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
  getEmptyFilters(): ContractSearchModel {

    return new ContractSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, ContractSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      (options: RuntimeOptionsInterface): ContractSearchOptionsInterface => {

        return {
          step: options.propertyContractStep,
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
        formOptions: ContractSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof ContractSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          contractStepId: {
            translation: 'keyword_contract_step',
            option: 'step',
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

            // Name
            if (keyword.name === 'contractReference') {

              updatedKeyword.translation = 'keyword_contract_reference';
              updatedKeyword.isRemovable = true;

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
  protected selectDefaultFilters(): Observable<ContractSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'reference',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<ContractModel> {

    return selectDataContracts;
  }
}
