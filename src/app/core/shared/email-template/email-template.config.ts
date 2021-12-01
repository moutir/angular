import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class EmailTemplateConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.emailTemplate;
  readonly ENTITY_ROUTE_BASE: string = 'email-template';
  readonly ICON: string = 'email';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionLanguageCommunication,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.mailboxTemplateRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.mailboxTemplateWrite;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.emailTemplateReadInformation,
    PageTabEnum.emailTemplateReadContent,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.emailTemplateWriteRequired,
  ];
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof EmailTemplateModel> = {};
}
