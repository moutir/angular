import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { MatchingGroupConfig } from './matching-group.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingGroupService } from './matching-group.service';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class MatchingGroupPageService extends PageServiceAbstract<MatchingGroupModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: MatchingGroupConfig,
    protected modelService: MatchingGroupService,
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

    this.router.navigate(['/dashboard']);
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

        return ['label_global_matching_grouped'];
      },
    );
  }
}
