import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { combineLatest, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { WebsiteConfig } from './website.config';
import { WebsiteModel } from '../../../shared/model/website.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteService } from './website.service';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { WebsiteOptionsInterface } from '../../../shared/interface/website-options.interface';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class WebsitePageService extends PageServiceAbstract<WebsiteModel, WebsiteOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: WebsiteConfig,
    protected modelService: WebsiteService,
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
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * Return the tab UID for a write-content tab in the given language
   */
  getWriteContentTabUid(language: LanguageEnum): PageTabEnum {

    return <PageTabEnum>[PageTabEnum.websiteWriteContent, language].join('#');
  }

  /**
   * @inheritDoc
   */
  selectModel(): Observable<WebsiteModel> {

    return combineLatest([
      this.store$.select(this.getSelectorModel()),
      this.runtimeService.selectOptions(),
    ])
      .pipe(
        map(([model, runtimeOptions]) => {

          const newModel = model.clone<WebsiteModel>();

          // Layout
          if (!newModel.layoutId && runtimeOptions.websiteLayout.length > 0) {

            newModel.layoutId = runtimeOptions.websiteLayout[0].value;
          }

          // Template
          if (!newModel.templateId && runtimeOptions.websiteTemplate.length > 0) {

            newModel.templateId = runtimeOptions.websiteTemplate[0].value;
          }

          return newModel;
        }),
      );
  }

  /**
   * @inheritDoc
   */
  selectTabUids(): Observable<PageTabEnum[]> {

    return zip(
      this.selectType(),
      this.runtimeService.selectAvailableLanguageIds(),
    )
    .pipe(
      map(([type, availableLanguageIds]) => {

        if (type === PageTypeEnum.read) {

          return this.getReadTabUids();
        }

        if (type === PageTypeEnum.write) {

          const tabUids = this.getWriteTabUids();

          availableLanguageIds.forEach(languageId => tabUids.push(
            this.getWriteContentTabUid(languageId) as PageTabEnum,
          ));

          return tabUids;
        }

        return [];
      }),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, WebsiteOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ): WebsiteOptionsInterface => {

        return {
          layout: options.websiteLayout,
          template: options.websiteTemplate,
          language: options.languageCommunication,
          broker: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: WebsiteModel, language: LanguageEnum): string {

    return model.url || super.getModelPageTitle(model, language);
  }
}
