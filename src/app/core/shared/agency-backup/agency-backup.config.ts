import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AgencyBackupConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.agencyBackup;
  readonly ENTITY_ROUTE_BASE: string = 'data-backup';
  readonly ICON: string = 'cloud_download';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyBackupRead;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
