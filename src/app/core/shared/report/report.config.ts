import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class ReportConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.report;
  readonly ENTITY_ROUTE_BASE: string = 'report';
  readonly ICON: string = 'assignment';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.authentication,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.featureReport,
    RuntimeDataEnum.optionReportType,
    RuntimeDataEnum.optionReportPropertyType,
    RuntimeDataEnum.optionReportScheduleType,
    RuntimeDataEnum.optionReportOwnerBrochureType,
    RuntimeDataEnum.optionReportOtherBrochureType,
    RuntimeDataEnum.optionReportDeveloperBrochureType,
    RuntimeDataEnum.optionHasBroker,
    RuntimeDataEnum.optionHasInformation,
    RuntimeDataEnum.optionHasPrice,
    RuntimeDataEnum.optionHasLead,
    RuntimeDataEnum.optionHasSummary,
    RuntimeDataEnum.optionHasMarketingExpense,
    RuntimeDataEnum.optionHasTimeEvolution,
    RuntimeDataEnum.optionHasOffer,
    RuntimeDataEnum.optionHasProposition,
    RuntimeDataEnum.optionHasPastVisit,
    RuntimeDataEnum.optionHasPlannedVisit,
    RuntimeDataEnum.optionHasCommunication,
    RuntimeDataEnum.optionFrequency,
    RuntimeDataEnum.optionDateRange,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.reportingRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.reportingManager;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.reportReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.reportWriteRequired,
  ];

}
