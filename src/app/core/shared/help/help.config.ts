import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

@Injectable()
export class HelpConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.help;
  readonly ENTITY_ROUTE_BASE: string = 'help';
  readonly ICON: string = 'help';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.crmLogin;
}
