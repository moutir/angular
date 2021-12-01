import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class PromotionConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.promotion;
  readonly ENTITY_ROUTE_BASE: string = 'promotion';
  readonly ICON: string = 'location_city';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.featurePromotion,
    RuntimeDataEnum.featureBrochure,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionPromotionStatus,
    RuntimeDataEnum.optionAgencyGroup,
    RuntimeDataEnum.optionAgencyMls,
    RuntimeDataEnum.optionAgencyUser,
    RuntimeDataEnum.optionAgencyGroupAll,
    RuntimeDataEnum.optionAgencyMlsAll,
    RuntimeDataEnum.optionPromotionBrochureType,
    RuntimeDataEnum.optionBrochurePrivacy,
    RuntimeDataEnum.optionBrochureQuality,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionCustomAttribute,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.promotionRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.promotionWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.promotionReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.promotionWriteRequired,
  ];

}
