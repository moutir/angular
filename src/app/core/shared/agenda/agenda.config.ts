import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';

@Injectable()
export class AgendaConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.agenda;
  readonly ENTITY_ROUTE_BASE: string = 'agenda';
  readonly ICON: string = 'calendar_today';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.agency,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionAgenda,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agendaRead;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
