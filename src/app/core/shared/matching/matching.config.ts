import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class MatchingConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.matching;
  readonly ENTITY_ROUTE_BASE: string = 'matching';
  readonly ICON: string = 'compare_arrows';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.featureMatching,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerByAgency,
    RuntimeDataEnum.optionMatchingStatus,
    RuntimeDataEnum.optionMatchingProcessMethod,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.matchingRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.matchingRead; // Yes, it's the same as "read"
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.matchingReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.matchingWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
