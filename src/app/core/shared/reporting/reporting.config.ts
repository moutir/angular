import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class ReportingConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.reporting;
  readonly ENTITY_ROUTE_BASE: string = 'reporting';
  readonly ICON: string = 'assignment';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.authentication,
    RuntimeDataEnum.featureReporting,
    RuntimeDataEnum.optionPropertyCategory,
    RuntimeDataEnum.optionPriceSell,
    RuntimeDataEnum.optionBedroom,
    RuntimeDataEnum.optionLivingArea,
    RuntimeDataEnum.optionLandArea,
    RuntimeDataEnum.optionPosition,
    RuntimeDataEnum.optionView,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionPropertyStatus,
    RuntimeDataEnum.optionReportingType,
    RuntimeDataEnum.optionReportingStatus,
    RuntimeDataEnum.optionPublicationGateway,
    RuntimeDataEnum.optionPublicationWebsite,
    RuntimeDataEnum.optionPublicationStatus,
    RuntimeDataEnum.optionRanking,
    RuntimeDataEnum.optionVisibility,
    RuntimeDataEnum.optionIsDirectTransaction01,
    RuntimeDataEnum.optionIsPromotion01,
    RuntimeDataEnum.optionIsSellToForeigner01,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.reportingRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.reportingManager;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.reportingReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.reportingWriteRequired,
  ];

}
