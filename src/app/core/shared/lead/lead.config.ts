import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { LeadModel } from '../../../shared/model/lead.model';

@Injectable()
export class LeadConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.lead;
  readonly ENTITY_ROUTE_BASE: string = 'leads';
  readonly ICON: string = 'chat';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.featureLead,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionLeadStatus,
    RuntimeDataEnum.optionLeadSource,
    RuntimeDataEnum.optionLeadType,
    RuntimeDataEnum.optionMedia,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.leadRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.leadWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.leadReadGeneral,
    PageTabEnum.leadReadEmail,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.leadWriteGeneral,
    PageTabEnum.leadWriteContactValidation,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof LeadModel> = {
    lead_date: 'contactDate',
    lead_type: 'typeId',
    main_lead_source: 'sourceId',
    lead_original_communication_mean: 'mediaId',
    lead_status: 'statusId',
    lead_property: 'properties',
    lead_promotion: 'promotions',
    lead_contact: 'contact',
  };
}
