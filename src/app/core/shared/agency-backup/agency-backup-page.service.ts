import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AgencyBackupConfig } from './agency-backup.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyBackupService } from './agency-backup.service';
import { AgencyBackupModel } from '../../../shared/model/agency-backup.model';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AgencyBackupPageService extends PageServiceAbstract<AgencyBackupModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AgencyBackupConfig,
    protected modelService: AgencyBackupService,
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
    if (type !== PageTypeEnum.write) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorTitle(): MemoizedSelector<StateInterface, string> {

    return createSelector(
      selectDataPermissions,
      (permissions: PermissionEnum[]): string => {

        return 'label_my_agency';
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

        return ['label_data_backup'];
      },
    );
  }
}
