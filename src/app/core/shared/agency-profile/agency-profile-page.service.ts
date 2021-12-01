import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AgencyProfileConfig } from './agency-profile.config';
import { AgencyModel } from '../../../shared/model/agency.model';
import { AgencyOptionsInterface } from '../../../shared/interface/agency-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyProfileService } from './agency-profile.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AgencyProfilePageService extends PageServiceAbstract<AgencyModel, AgencyOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AgencyProfileConfig,
    protected modelService: AgencyProfileService,
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

    super.setPage(type, 'agency');
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === PageTypeEnum.list) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: AgencyModel, language: LanguageEnum): string {

    return 'page_header_agency';
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, AgencyOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (options: RuntimeOptionsInterface) => {

        return {
          socialMedia: options.socialMedia,
          country: options.countryById,
          emailTemplate: options.emailTemplate,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSubtitles(): MemoizedSelector<StateInterface, string[]> {

    return createSelector(
      selectDataPermissions,
      (
        permissions: PermissionEnum[],
      ): string[] => {

        // No read permission
        if (permissions.indexOf(this.moduleConfig.PERMISSION_READ) === -1) {

          return ['breadcrumb_access_denied'];
        }

        return ['label_profile'];
      },
    );
  }
}
