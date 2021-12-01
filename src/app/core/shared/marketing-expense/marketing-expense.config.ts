import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';

@Injectable()
export class MarketingExpenseConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.marketingExpense;
  readonly ICON: string = 'explicit';
  readonly ENTITY_ROUTE_BASE: string = 'marketing-expense';
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionLeadSource,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyMarketingRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.agencyMarketingWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.marketingExpenseReadGeneral,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.marketingExpenseWriteGeneral,
  ];
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof MarketingExpenseModel> = {
    invoice_date: 'invoiceDate',
  };
}
