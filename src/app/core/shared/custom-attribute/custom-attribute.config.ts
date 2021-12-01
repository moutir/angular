import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class CustomAttributeConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.customAttribute;
  readonly ENTITY_ROUTE_BASE: string = 'custom-attribute';
  readonly ICON: string = 'loupe';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionCustomAttributeUsable,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.customAttributeRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.customAttributeWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.customAttributeReadInformation,
    PageTabEnum.customAttributeReadPropertySale,
    PageTabEnum.customAttributeReadPropertyRent,
    PageTabEnum.customAttributeReadPromotion,
    PageTabEnum.customAttributeReadContact,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.customAttributeWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, string> = {
    '/data/attributes/title': 'name',
    '/data/attributes/restrictions': 'usable',
    '/data/relationships/custom_attribute/data/label': 'values.{i}.label',
  };
}
