import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class MlsConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.mls;
  readonly ENTITY_ROUTE_BASE: string = 'mls';
  readonly ICON: string = 'device_hub';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.contactTypeByGroup,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.mlsRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.mlsWrite;

  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.mlsReadOverview,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.mlsWriteOverview,
  ];
}
