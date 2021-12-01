import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { CustomAttributeConfig } from './custom-attribute.config';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { CustomAttributeOptionsInterface } from '../../../shared/interface/custom-attribute-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { CustomAttributeService } from './custom-attribute.service';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { Observable } from 'rxjs';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { CustomAttributeTypeEnum } from '../../../shared/enum/custom-attribute-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class CustomAttributePageService extends PageServiceAbstract<CustomAttributeModel, CustomAttributeOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: CustomAttributeConfig,
    protected modelService: CustomAttributeService,
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
  selectTabUids(): Observable<PageTabEnum[]> {

    return this.store$.select(createSelector(
      selectUiType,
      this.getSelectorModel(),
      (
        type: PageTypeEnum,
        model: CustomAttributeModel,
      ) => {

        if (type === PageTypeEnum.read) {

          return this
            .getReadTabUids()
            .filter(tabUid => {

              // Property sell or rent
              if (tabUid === PageTabEnum.customAttributeReadPropertySale || tabUid === PageTabEnum.customAttributeReadPropertyRent) {

                return model.usable.indexOf(CustomAttributeTypeEnum.property) > -1;
              }

              // Promotion
              if (tabUid === PageTabEnum.customAttributeReadPromotion) {

                return model.usable.indexOf(CustomAttributeTypeEnum.promotion) > -1;
              }

              // Contact
              if (tabUid === PageTabEnum.customAttributeReadContact) {

                return model.usable.indexOf(CustomAttributeTypeEnum.contact) > -1;
              }

              return true;
            });
        }

        if (type === PageTypeEnum.write) {

          return this.getWriteTabUids();
        }

        return [];
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: CustomAttributeModel, language: LanguageEnum): string {

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

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, CustomAttributeOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (options: RuntimeOptionsInterface) => {

        return {
          usable: options.customAttributeUsable,
        };
      },
    );
  }
}
