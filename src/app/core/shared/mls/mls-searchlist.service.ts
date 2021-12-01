import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';

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
import { selectDataMlsPartnerships } from '../../../core-store/data-mls/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MlsConfig } from './mls.config';
import { MlsModel } from '../../../shared/model/mls.model';
import { MlsSearchModel } from '../../../shared/model/mls-search.model';
import { MlsSearchOptionsInterface } from '../../../shared/interface/mls-search-options.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class MlsSearchlistService extends SearchlistServiceAbstract<
  MlsModel,
  MlsSearchModel,
  MlsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MlsConfig,
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
  getEmptyFilters(): MlsSearchModel {

    return new MlsSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, MlsSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      (
        form: MlsSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
      ): MlsSearchOptionsInterface => {

        return {};
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
        formOptions: MlsSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof MlsSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Partner agency ID
            if (keyword.name === 'partnerAgencyId') {

              updatedKeyword.translation = 'keyword_partner';

              if (autocompleteOptions.mls[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.mls[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            return updatedKeyword;
          });
      },
    );
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
  protected selectDataModels(): (state: StateInterface) => Dictionary<MlsModel> {

    return selectDataMlsPartnerships;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<MlsSearchModel> {

    return of(this.getEmptyFilters());
  }
}
