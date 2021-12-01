import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class RestrictionConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.restriction;
  readonly ENTITY_ROUTE_BASE: string = 'restriction';
  readonly ICON: string = 'gavel';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.featureRestriction,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerByAgency,
    RuntimeDataEnum.optionAgencyRelated,
    RuntimeDataEnum.optionGroupOfAgency,
    RuntimeDataEnum.optionPropertyCategory,
    RuntimeDataEnum.optionTransactionType,
    RuntimeDataEnum.optionTransaction,
    RuntimeDataEnum.optionCustomAttribute,
    RuntimeDataEnum.optionSector,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.restrictionRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.restrictionWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.restrictionReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.restrictionWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, string> = {
    name: 'name',
    module: 'module',
    'conditionRules': 'conditionRules',
    'conditionRules[{i}].attribute': 'conditionRules.{i}.attribute',
    'conditionRules[{i}].operator': 'conditionRules.{i}.operator',
    'conditionRules[{i}].value': 'conditionRules.{i}.value',
    'validationRules': 'validationRules',
    'validationRules[{i}].attribute': 'validationRules.{i}.attribute',
    'validationRules[{i}].operator': 'validationRules.{i}.operator',
    'validationRules[{i}].value': 'validationRules.{i}.value',
    'brokerTargets': 'brokerTargets',
    'agencyTargets': 'agencyTargets',
    'groupTargets': 'groupTargets',
  };
}
