import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class AccountConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.account;
  readonly ENTITY_ROUTE_BASE: string = 'account';
  readonly ICON: string = 'admin_panel_settings';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.authentication,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.featureAccount,
    RuntimeDataEnum.optionAgencyRelated,
    RuntimeDataEnum.optionAccountType,
    RuntimeDataEnum.optionIsActive01,
    RuntimeDataEnum.optionLanguageCommunication,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.accountRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.accountWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.accountReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.accountWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, string> = {
    login: 'login',
    contact_firstname: 'firstName',
    contact_lastname: 'lastName',
    account_type: 'accountTypeId',
    password: 'password',
    password_confirm: 'passwordConfirm',
    passwordConfirm: 'passwordConfirm',
    expiry_date: 'expiryDate',
    language: 'languageId',
    agency: 'agencyId',
  };
}
