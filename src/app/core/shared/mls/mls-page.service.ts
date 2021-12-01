import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { MlsConfig } from './mls.config';
import { MlsModel } from '../../../shared/model/mls.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MlsService } from './mls.service';
import { MlsOptionsInterface } from '../../../shared/interface/mls-options.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';
import { selectUiEntity, selectUiId, selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { selectDataLanguageCurrent, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { MlsStatusEnum } from '../../../shared/enum/mls-status.enum';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class MlsPageService extends PageServiceAbstract<MlsModel, MlsOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: MlsConfig,
    protected modelService: MlsService,
    protected translateService: TranslateService,
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
   * @inheritDoc
   */
  protected getModelPageTitle(model: MlsModel, language?: LanguageEnum): string {

    return this.translateService.instant('label_mls_with_agency', { agency: model.partnerAgency.name });
  }

  /**
   * @inheritDoc
   */
  protected getSelectorTitle(): MemoizedSelector<StateInterface, string> {

    return createSelector(
      this.getSelectorModel(),
      selectUiId,
      selectUiType,
      selectUiEntity,
      selectDataPermissions,
      selectDataLanguageCurrent,
      (
        model: MlsModel,
        id: string,
        type: PageTypeEnum,
        entity: EntityEnum,
        permissions: PermissionEnum[],
        language: LanguageEnum,
      ): string => {

        // Page "read" or "write"
        if (
          permissions.indexOf(this.getPermissionRead()) > -1 && id && (type === PageTypeEnum.read || type === PageTypeEnum.write)
        ) {

          return model && model.id ? this.getModelPageTitle(model, language) : 'label_loading_records';
        }

        if (type === PageTypeEnum.write) {

          return model && model.partnerAgency.id ? this.getModelPageTitle(model, language) : 'label_mls_invitation';
        }

        // Default
        return 'page_header_' + entity;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSubtitles(): MemoizedSelector<StateInterface, string[]> {

    return createSelector(
      selectDataPermissions,
      selectUiType,
      (
        permissions: PermissionEnum[],
        type: PageTypeEnum,
      ): string[] => {

        // No read permission
        if (permissions.indexOf(this.getPermissionRead()) === -1) {

          return ['breadcrumb_access_denied'];
        }

        switch (type) {

          // Read page
          case PageTypeEnum.read:
            return ['breadcrumb_preview'];

          // Write page
          case PageTypeEnum.write:
            return ['label_invitation'];

          // List page
          case PageTypeEnum.list:
            return ['breadcrumb_list'];

          // Loading
          case PageTypeEnum.loading:
          default:
            return ['breadcrumb_wait'];
        }
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorPrimaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      this.getSelectorModel(),
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
        model: MlsModel,
      ): ButtonTypeEnum|null => {

        // Page list
        if (
          type === PageTypeEnum.list &&
          this.moduleConfig.IS_SUPPORTING_PAGE_ADD === true &&
          permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1
        ) {

          return ButtonTypeEnum.add;
        }

        // Page search
        if (type === PageTypeEnum.search) {

          return ButtonTypeEnum.searchSubmit;
        }

        // Page read
        if (type === PageTypeEnum.read) {

          if (permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) === -1) {

            return null;
          }

          // Sent status
          if (model.statusId === MlsStatusEnum.pending) {

            return ButtonTypeEnum.uninvite;

          // Received status
          } else if (model.statusId === MlsStatusEnum.received) {

            return ButtonTypeEnum.reject;

          // Ongoing status
          } else if (model.statusId === MlsStatusEnum.ongoing) {

            return ButtonTypeEnum.terminate;
          }

          return null;
        }

        // Page write
        if (type === PageTypeEnum.write && model.partnerAgency.isAllowedSendMLSInvite === true) {

          return ButtonTypeEnum.sendInvite;
        }

        return null;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSecondaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      this.getSelectorModel(),
      selectDataPermissions,
      (
        model: MlsModel,
        permissions: PermissionEnum[],
      ): ButtonTypeEnum|null => {

        if (permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) === -1) {

          return null;
        }

        // Received status
        if (model.statusId === MlsStatusEnum.received) {

          return ButtonTypeEnum.accept;
        }

        return null;
      },
    );
  }
}
