import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class DeviceConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.device;
  readonly ENTITY_ROUTE_BASE: string = 'device';
  readonly ICON: string = 'phonelink_setup';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.optionDeviceType,
    RuntimeDataEnum.optionAgencyUsers,
    RuntimeDataEnum.optionBrokerColleague,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyDeviceRead;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;

}
