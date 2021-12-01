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
import { selectDataEmailTemplates } from '../../../core-store/data-email-template/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailTemplateConfig } from './email-template.config';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { EmailTemplateSearchModel } from '../../../shared/model/email-template-search.model';
import { EmailTemplateSearchOptionsInterface } from '../../../shared/interface/email-template-search-options.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class EmailTemplateSearchlistService extends SearchlistServiceAbstract<
  EmailTemplateModel,
  EmailTemplateSearchModel,
  EmailTemplateSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: EmailTemplateConfig,
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
  getEmptyFilters(): EmailTemplateSearchModel {

    return new EmailTemplateSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, EmailTemplateSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      (
        form: EmailTemplateSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
      ): EmailTemplateSearchOptionsInterface => {

        return {
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
        formOptions: EmailTemplateSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof EmailTemplateSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
        };

        return [];
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'creator_name',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<EmailTemplateModel> {

    return selectDataEmailTemplates;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<EmailTemplateSearchModel> {

    return of(this.getEmptyFilters());
  }
}
