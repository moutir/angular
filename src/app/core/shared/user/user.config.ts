import { Injectable } from '@angular/core';

import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { ModuleConfig } from '../../../shared/class/module-config';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { UserModel } from '../../../shared/model/user.model';

@Injectable()
export class UserConfig extends ModuleConfig {

  readonly ENTITY: EntityEnum = EntityEnum.user;
  readonly ENTITY_ROUTE_BASE: string = 'user';
  readonly ICON: string = 'account_circle';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = []; // Handled by component/service, merge of account + contact

  // Will be overridden by STRATEGY.permission
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.accountMyProfile;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.accountMyProfile;

  readonly READ_TAB_UIDS: PageTabEnum[] = [];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.userWriteContact,
    PageTabEnum.userWriteDocument,
    PageTabEnum.userWriteAccount,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof UserModel> = {}; // Handled by component/service, merge of account + contact
}
