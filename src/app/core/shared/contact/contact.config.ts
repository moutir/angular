import { Injectable } from '@angular/core';

import { BrowserService } from '../browser/browser.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { ModuleConfig } from '../../../shared/class/module-config';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { ContactModel } from '../../../shared/model/contact.model';

@Injectable()
export class ContactConfig extends ModuleConfig {

  readonly ENTITY: EntityEnum = EntityEnum.contact;
  readonly ENTITY_ROUTE_BASE: string = 'contact';
  readonly ICON: string = 'account_circle';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.featureContact,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionContactMode,
    RuntimeDataEnum.optionCircle,
    RuntimeDataEnum.optionContactType,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionIsDirectClient01,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerByAgency,
    RuntimeDataEnum.optionBrokerSellByAgency,
    RuntimeDataEnum.optionBrokerRentByAgency,
    RuntimeDataEnum.optionRanking,
    RuntimeDataEnum.optionVisibility,
    RuntimeDataEnum.optionTransaction,
    RuntimeDataEnum.optionBedroom,
    RuntimeDataEnum.optionArea,
    RuntimeDataEnum.optionPosition,
    RuntimeDataEnum.optionView,
    RuntimeDataEnum.optionContactSearch,
    RuntimeDataEnum.optionContactSearchType,
    RuntimeDataEnum.optionLastContact,
    RuntimeDataEnum.optionContactOrigin,
    RuntimeDataEnum.optionPropertyCategory,
    RuntimeDataEnum.optionPriceSell,
    RuntimeDataEnum.optionPriceRent,
    RuntimeDataEnum.optionIsVip01,
    RuntimeDataEnum.optionAgencyGroup,
    RuntimeDataEnum.optionAgencyMls,
    RuntimeDataEnum.optionAgencyUser,
    RuntimeDataEnum.optionAgencyGroupAll,
    RuntimeDataEnum.optionAgencyMlsAll,
    RuntimeDataEnum.optionContactSpecialType,
    RuntimeDataEnum.optionCustomAttribute,
    RuntimeDataEnum.optionContactRestrictLocation,
    RuntimeDataEnum.authentication,
    RuntimeDataEnum.optionHomePage,
    RuntimeDataEnum.optionMenuDisplay,
    RuntimeDataEnum.optionContactTitle,
    RuntimeDataEnum.optionContactGreeting,
    RuntimeDataEnum.optionNationality,
    RuntimeDataEnum.optionMaritalStatus,
    RuntimeDataEnum.optionChildren,
    RuntimeDataEnum.optionPipelineStage,
    RuntimeDataEnum.optionCountryById,
    RuntimeDataEnum.optionSocialMedia,
    RuntimeDataEnum.optionAccountType,
  ];

  // Will be overridden by STRATEGY.permission
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.contactRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.contactWrite;

  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.contactReadProfile,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.contactWriteProfile,
    PageTabEnum.contactWriteDocument,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof ContactModel> = {
    contact_lastName: 'lastName',
    contact_birthday: 'birthDate',
  };

  /**
   * List of contact IDs put into the basket  // TODO[later] remove once fully on angular
   */
  readonly basketContactIds: string[] = [];

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    super();

    // Get backend config
    const config = this.browserService.getRealforceConfig<ContactConfig>().contact;

    // Store config in memory
    this.basketContactIds = config.basketContactIds.map(contactId => String(contactId)) || this.basketContactIds;
  }
}
