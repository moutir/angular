import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class ProcessConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.process;
  readonly ENTITY_ROUTE_BASE: string = 'process';
  readonly ICON: string = 'rule';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.authentication,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.optionProcessType,
    RuntimeDataEnum.optionProcessStatus,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyProfileRead;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.processReadLogs,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = false;
}
