import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { SectorConfig } from './sector.config';
import { SectorModel } from '../../../shared/model/sector.model';
import { SectorOptionsInterface } from '../../../shared/interface/sector-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SectorService } from './sector.service';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class SectorPageService extends PageServiceAbstract<SectorModel, SectorOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: SectorConfig,
    protected modelService: SectorService,
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
  protected getModelPageTitle(model: SectorModel, language: LanguageEnum): string {

    return model.name || super.getModelPageTitle(model, language);
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
