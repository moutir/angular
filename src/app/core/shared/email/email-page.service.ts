import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { EmailConfig } from './email.config';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { EmailModel } from '../../../shared/model/email.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailService } from './email.service';

@Injectable()
export class EmailPageService extends PageServiceAbstract<EmailModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: EmailConfig,
    protected modelService: EmailService,
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

        return ['label_email_history'];
      },
    );
  }
}
