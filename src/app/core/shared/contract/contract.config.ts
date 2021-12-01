import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { ContractModel } from '../../../shared/model/contract.model';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class ContractConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.contract;
  readonly ENTITY_ROUTE_BASE: string = 'contract';
  readonly ICON: string = 'description';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionAgencyGroup,
    RuntimeDataEnum.optionAgencyMls,
    RuntimeDataEnum.optionAgencyUser,
    RuntimeDataEnum.optionAgencyGroupAll,
    RuntimeDataEnum.optionAgencyMlsAll,
    RuntimeDataEnum.optionContactType,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionPropertyContractSellType,
    RuntimeDataEnum.optionPropertyContractContactType,
    RuntimeDataEnum.optionPropertyContractStep,
    RuntimeDataEnum.optionPropertyContractCommissionType,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.contractRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.contractWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.contractReadGeneral,
    PageTabEnum.contractReadDeal,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.contractWriteGeneral,
    PageTabEnum.contractWriteDeal,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof ContractModel> = {
    '/data/attributes/reference': 'reference',
    '/data/attributes/step': 'stepId',
    '/data/attributes/sell_type': 'sellTypeId',
    '/data/attributes/project_date': 'projectDate',
    '/data/attributes/offer_date': 'offerDate',
    '/data/attributes/agreement_date': 'agreementDate',
    '/data/attributes/agreement_cooling_off_end_date': 'coolingOffEndDate',
    '/data/attributes/agreement_condition_precedent_date': 'conditionPrecedentDate',
    '/data/attributes/forecast_dead_of_sale_scheduled_date': 'scheduleDate',
    '/data/attributes/forecast_dead_of_sale_contract_date': 'contractDate',
    '/data/attributes/forecast_dead_of_sale_collected_date': 'collectionDate',
    '/data/attributes/billing_date': 'billingDate',
    '/data/attributes/asking_price': 'askingPrice',
    '/data/attributes/negotiated_price_percentage': 'negotiatedPricePercentage',
    '/data/attributes/negotiated_price': 'negotiatedPrice',
    '/data/attributes/deposit_amount_percentage': 'depositAmountPercentage',
    '/data/attributes/deposit_amount': 'depositAmount',
    '/data/attributes/fees': 'agencyFee',
    '/data/attributes/fees_percentage': 'agencyFeePercentage',
    '/data/attributes/funding_personal_contribution': 'fundAmountPersonal',
    '/data/attributes/funding_condition_precedent_date': 'fundConditionPrecedentDate',
    '/data/attributes/funding_mortgage_amount': 'fundAmountMortgage',
    '/data/attributes/funding_accepted_date': 'fundAcceptDate',
    '/data/relationships/property/data/id': <keyof ContractModel>'propertyId',
  };
}
