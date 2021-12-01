import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PortalModel } from '../../../shared/model/portal.model';
import { PortalConfig } from './portal.config';
import { PortalService } from './portal.service';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { PortalOptionsInterface } from '../../../shared/interface/portal-options.interface';
import { selectDataLanguageAvailable } from '../../../core-store/data-runtime/selectors';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class PortalPageService extends PageServiceAbstract<PortalModel, PortalOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: PortalConfig,
    protected modelService: PortalService,
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
   * Select agency country
   */
  selectAgencyCountry(): Observable<string> {

    return this.store$.select(
      createSelector(
        this.runtimeService.getSelectorOptions(),
        this.getSelectorModel(),
        (
          options: RuntimeOptionsInterface,
          model: PortalModel,
        ): string => {

          const country = (options.countryByCode || []).find(c => c.value === model.agency.countryId);

          return country ? country.text : '';
        },
      ),
    );
  }

  /**
   * Select portal
   */
  selectPortal(): Observable<string> {

    return this.store$.select(
      createSelector(
        this.runtimeService.getSelectorOptions(),
        this.getSelectorModel(),
        (
          options: RuntimeOptionsInterface,
          model: PortalModel,
        ): string => {

          const portal = options.portalList.find(option => option.value === model.portalId);

          return portal ? portal.text : '';
        },
      ),
    );
  }

  /**
   * Select agency website
   */
  selectAgencyWebsite(): Observable<string> {

    return this.store$.select(
      createSelector(
        this.runtimeService.getSelectorOptions(),
        this.getSelectorModel(),
        (
          options: RuntimeOptionsInterface,
          model: PortalModel,
        ): string => {

          if (!model.agencyWebsiteId) {

            return '';
          }

          const agencyWebsite = options.publicationWebsite.find(option => option.value === model.agencyWebsiteId);

          return agencyWebsite ? agencyWebsite.text : '';
        },
      ),
    );
  }

  /**
   * Select portal language
   */
  selectPortalLanguage(): Observable<string> {

    return this.store$.select(
      createSelector(
        selectDataLanguageAvailable,
        this.getSelectorModel(),
        (
          availableLanguages: KeyValueType<LanguageEnum, string>,
          model: PortalModel,
        ): string => {

          const languageCode = (model.languageCode || '').toLocaleLowerCase();

          return availableLanguages[languageCode] || '';
        },
      ),
    );
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, PortalOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (options: RuntimeOptionsInterface): PortalOptionsInterface => {

        return <PortalOptionsInterface>{
          portalLanguage: options.portalLanguage,
          portalCountry: options.countryByCode,
          sendLeadCopy: options.portalSendLeadCopy,
          portalList: options.portalList,
          agencyWebsiteList: options.publicationWebsite,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: PortalModel, language: LanguageEnum): string {

    return model.label || super.getModelPageTitle(model, language);
  }
}
