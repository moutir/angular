import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class ProductionConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.production;
  readonly ENTITY_ROUTE_BASE: string = 'production';
  readonly ICON: string = 'bar_chart';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.agency,
    RuntimeDataEnum.contactTypeByGroup,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyProductionRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.agencyProductionWrite;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = false;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.productionReadSaleYearly,
    PageTabEnum.productionReadSaleMonthly,
    PageTabEnum.productionReadRentalYearly,
    PageTabEnum.productionReadRentalMonthly,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.productionWriteSaleYearly,
    PageTabEnum.productionWriteSaleMonthly,
    PageTabEnum.productionWriteRentalYearly,
    PageTabEnum.productionWriteRentalMonthly,
  ];
}
