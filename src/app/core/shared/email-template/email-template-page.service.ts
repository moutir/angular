import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, zip } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { EmailTemplateConfig } from './email-template.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { EmailTemplateModelContentAdapterStrategy } from './email-template-model-content-adapter.strategy';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { map } from 'rxjs/operators';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class EmailTemplatePageService extends PageServiceAbstract<EmailTemplateModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: EmailTemplateConfig,
    protected modelService: EmailTemplateService,
    protected contentModelAdapterStrategy: EmailTemplateModelContentAdapterStrategy,
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
   * Return the tab UID for a write-content tab in the given language
   */
  getWriteContentTabUid(language: LanguageEnum): PageTabEnum {

    return <PageTabEnum>[PageTabEnum.emailTemplateWriteContent, language].join('#');
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
  protected getModelPageTitle(model: EmailTemplateModel, language: LanguageEnum): string {

    return model.label || 'page_header_emailTemplate';
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];

        // Page read with write permission
        if (type === PageTypeEnum.read && permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1) {

          items.push({
            id: 'remove',
            label: 'label_remove',
            icon: 'delete_forever',
            tooltip: 'label_delete_forever',
            isEnabled: true,
            items: [],
          });
        }

        return { items };
      },
    );
  }
}
