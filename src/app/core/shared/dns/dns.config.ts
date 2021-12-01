import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class DnsConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.dns;
  readonly ENTITY_ROUTE_BASE: string = 'dns';
  readonly ICON: string = 'router';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.domainNameRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.domainNameRead;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;

}
