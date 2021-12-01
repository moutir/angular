import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class EmailConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.emailSent;
  readonly ENTITY_ROUTE_BASE: string = 'email/sent';
  readonly ICON: string = 'mail';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionEmailStatus,
    RuntimeDataEnum.optionEmailAttachmentType,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.mailboxRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.mailboxWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.emailReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.emailWriteRequired,
  ];
}
