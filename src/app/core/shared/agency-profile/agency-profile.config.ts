import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class AgencyProfileConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.agencyProfile;
  readonly ENTITY_ROUTE_BASE: string = 'agency-profile';
  readonly ICON: string = 'description';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.agency,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionSocialMedia,
    RuntimeDataEnum.optionCountryById,
    RuntimeDataEnum.optionEmailTemplate,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyProfileRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.agencyProfileWrite;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.agencyProfileReadProfile,
    PageTabEnum.agencyProfileReadImage,
    PageTabEnum.agencyProfileReadDocument,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.agencyProfileWriteProfile,
    PageTabEnum.agencyProfileWriteImage,
    PageTabEnum.agencyProfileWriteDocument,
  ];
}
