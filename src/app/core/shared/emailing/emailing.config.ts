import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class EmailingConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.emailing;
  readonly ENTITY_ROUTE_BASE: string = 'emailing';
  readonly ICON: string = 'email';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.agencyPreference,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.featureBrochure,
    RuntimeDataEnum.optionBrochurePrivacy,
    RuntimeDataEnum.optionPropertyBrochureType,
    RuntimeDataEnum.optionEmailContent,
    RuntimeDataEnum.optionEmailTemplate,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.mailboxRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.mailboxWrite;
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.emailingWriteGeneral,
    PageTabEnum.emailingWritePreview,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
