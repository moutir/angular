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
import { selectDataWebsites } from '../../../core-store/data-website/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteConfig } from './website.config';
import { WebsiteModel } from '../../../shared/model/website.model';
import { WebsiteSearchModel } from '../../../shared/model/website-search.model';
import { WebsiteSearchOptionsInterface } from '../../../shared/interface/website-search-options.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class WebsiteSearchlistService extends SearchlistServiceAbstract<
  WebsiteModel,
  WebsiteSearchModel,
  WebsiteSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteConfig,
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
  getEmptyFilters(): WebsiteSearchModel {

    return new WebsiteSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, WebsiteSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      (
        form: WebsiteSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
      ): WebsiteSearchOptionsInterface => {

        return {
          urls: [],
          privateAPIKeys: [],
          publicAPIKeys: [],
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
        formOptions: WebsiteSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof WebsiteSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Url
            if (keyword.name === 'url') {

              updatedKeyword.translation = 'keyword_website_url';
              updatedKeyword.isRemovable = true;

              return updatedKeyword;
            }

            // Private API Key
            if (keyword.name === 'privateAPIKey') {

              updatedKeyword.translation = 'keyword_private_api_key';
              updatedKeyword.isRemovable = true;

              return updatedKeyword;
            }

            // Private API Key
            if (keyword.name === 'publicAPIKey') {

              updatedKeyword.translation = 'keyword_public_api_key';
              updatedKeyword.isRemovable = true;

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
      id: 'main_url',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<WebsiteModel> {

    return selectDataWebsites;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<WebsiteSearchModel> {

    return of(this.getEmptyFilters());
  }
}
