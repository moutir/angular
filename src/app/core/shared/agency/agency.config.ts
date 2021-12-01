import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AgencyConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.agency;
  readonly ENTITY_ROUTE_BASE: string = 'agency';
  readonly ICON: string = 'settings_applications';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.agency,
    RuntimeDataEnum.contactTypeByGroup,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyProfileRead;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
