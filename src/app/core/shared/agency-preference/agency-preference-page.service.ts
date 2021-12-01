import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AgencyPreferenceOptionsInterface } from '../../../shared/interface/agency-preference-options.interface';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyPreferenceConfig } from './agency-preference.config';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';
import { AgencyPreferenceService } from './agency-preference.service';
import { AgencyPreferenceContentInterface } from '../../../shared/interface/agency-preference-content.interface';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class AgencyPreferencePageService extends PageServiceAbstract<
  AgencyPreferenceModel,
  AgencyPreferenceOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AgencyPreferenceConfig,
    protected modelService: AgencyPreferenceService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  setPage(type: PageTypeEnum, id: string|null): void {

    super.setPage(type, 'agency-preference');
  }

  /**
   * Select a dictionary of content based on the current agency preference values
   */
  selectContent(): Observable<AgencyPreferenceContentInterface> {

    return this.store$
      .select(createSelector(
        this.getSelectorModel(),
        this.getSelectorOptions(),
        (
          model: AgencyPreferenceModel|null,
          options: AgencyPreferenceOptionsInterface,
        ) => {

          const content: AgencyPreferenceContentInterface = {
            pages: [],
          };

          // For each page
          options.agencyPreference.forEach(page => {

            const contentPage = {
              label: page.label,
              preferences: [],
            };

            // For each preference
            page.preferences.forEach(preference => {

              // Converts snake case to camelCase
              const attr = preference.name.replace(/_[^_]/g, (txt) => txt.substr(1).toUpperCase());

              // Find selected option
              const option = preference.availableOptions.find(
                opt => opt.value === model[attr],
              );

              contentPage.preferences.push({
                label: preference.label,
                description: (option && option.description) || '',
                control: attr,
                options: preference.availableOptions,
              });
            });

            content.pages.push(contentPage);
          });

          return content;
        },
      ));
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type !== PageTypeEnum.write) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: AgencyPreferenceModel, language: LanguageEnum): string {

    return 'page_header_agencyPreference';
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, AgencyPreferenceOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (options: RuntimeOptionsInterface) => {

        return {
          agencyPreference: options.agencyPreference,
        };
      },
    );
  }
}
