import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class MatchingGroupConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.matchingGroup;
  readonly ENTITY_ROUTE_BASE: string = 'matching-group';
  readonly ICON: string = 'compare_arrows';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.featureMatching,
    RuntimeDataEnum.featureBrochure,
    RuntimeDataEnum.optionMatchingGroupEntity,
    RuntimeDataEnum.optionMatchingGroupType,
    RuntimeDataEnum.optionMatchingProcessMethod,
    RuntimeDataEnum.optionBrochurePrivacy,
    RuntimeDataEnum.optionPropertyBrochureType,
    RuntimeDataEnum.optionEmailContent,
    RuntimeDataEnum.optionEmailTemplate,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerByAgency,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.matchingRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.matchingRead; // Yes, it's the same as "read"
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.matchingGroupReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.matchingGroupWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
}
