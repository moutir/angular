import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { AccountModel } from '../../../shared/model/account.model';
import { AccountSearchOptionsInterface } from '../../../shared/interface/account-search-options.interface';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { selectDataAccounts } from '../../../core-store/data-account/selectors';
import { selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AccountConfig } from './account.config';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AccountSearchlistService extends SearchlistServiceAbstract<
  AccountModel,
  AccountSearchModel,
  AccountSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: AccountConfig,
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
  getEmptyFilters(): AccountSearchModel {

    return new AccountSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, AccountSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      selectDataPermissions,
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
      ): AccountSearchOptionsInterface => {

        return {
          accountTypeId: options.accountType,
          agencyId: permissions.indexOf(PermissionEnum.accountAdmin) > -1 ? options.agencyRelated : [],
          isActive01: options.isActive01,
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
        formOptions: AccountSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof AccountSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          accountTypeId: {
            translation: 'keyword_account_type',
            option: 'accountTypeId',
            isRemovable: true,
          },
          agencyId: {
            translation: 'keyword_agency',
            option: 'agencyId',
            isRemovable: true,
          },
          isActive01: {
            translation: 'keyword_default_label',
            option: 'isActive01',
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

            // Contact ID
            if (keyword.name === 'contactId') {

              updatedKeyword.translation = 'keyword_contact';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Login
            if (keyword.name === 'login') {

              updatedKeyword.translation = 'keyword_default_label';
              updatedKeyword.label = <string>keyword.value;

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
  protected selectDefaultFilters(): Observable<AccountSearchModel> {

    return of(this.getEmptyFilters());
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'login',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<AccountModel> {

    return selectDataAccounts;
  }
}
