import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { HelpConfig } from './help.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { HelpService } from './help.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { HelpModel } from '../../../shared/model/help.model';

@Injectable()
export class HelpPageService extends PageServiceAbstract<HelpModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: HelpConfig,
    protected modelService: HelpService,
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

    super.setPage(type, 'help');
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === PageTypeEnum.list) {

      this.router.navigate(['/dashboard']);
      return;
    }
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: HelpModel, language: LanguageEnum): string {

    return 'label_online_help';
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

        return ['label_list'];
      },
    );
  }
}
