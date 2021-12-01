import { Injectable } from '@angular/core';

import { BrowserService } from '../browser/browser.service';
import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

@Injectable()
export class PropertyConfig extends ModuleConfig {

  readonly ENTITY: EntityEnum = EntityEnum.property;
  readonly ENTITY_ROUTE_BASE: string = 'property';
  readonly ICON: string = 'home_work';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.agencyPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.featurePrice,
    RuntimeDataEnum.featureProperty,
    RuntimeDataEnum.featureBrochure,
    RuntimeDataEnum.optionPropertyType,
    RuntimeDataEnum.optionPropertyCategory,
    RuntimeDataEnum.optionPropertyStatus,
    RuntimeDataEnum.optionPriceRent,
    RuntimeDataEnum.optionPriceSell,
    RuntimeDataEnum.optionRoom,
    RuntimeDataEnum.optionBedroom,
    RuntimeDataEnum.optionLivingArea,
    RuntimeDataEnum.optionLandArea,
    RuntimeDataEnum.optionPosition,
    RuntimeDataEnum.optionView,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionPublicationGateway,
    RuntimeDataEnum.optionPublicationWebsite,
    RuntimeDataEnum.optionPublicationStatus,
    RuntimeDataEnum.optionRanking,
    RuntimeDataEnum.optionAgencyGroup,
    RuntimeDataEnum.optionAgencyMls,
    RuntimeDataEnum.optionAgencyUser,
    RuntimeDataEnum.optionAgencyGroupAll,
    RuntimeDataEnum.optionAgencyMlsAll,
    RuntimeDataEnum.optionVisibility,
    RuntimeDataEnum.optionIsDirectTransaction01,
    RuntimeDataEnum.optionIsPromotion01,
    RuntimeDataEnum.optionIsSellToForeigner01,
    RuntimeDataEnum.optionPropertyBrochureType,
    RuntimeDataEnum.optionBrochurePrivacy,
    RuntimeDataEnum.optionBrochureQuality,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionCustomAttribute,
    RuntimeDataEnum.optionSpace,
    RuntimeDataEnum.optionSector,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.propertyRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.propertyWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.propertyReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.propertyWriteRequired,
  ];

  /**
   * List of property IDs put into the basket  // TODO[later] remove once fully on angular
   */
  readonly basketPropertyIds: string[] = [];

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    super();

    // Get backend config
    const config = this.browserService.getRealforceConfig<PropertyConfig>().property;

    // Store config in memory
    this.basketPropertyIds = config.basketPropertyIds.map(propertyId => String(propertyId)) || this.basketPropertyIds;
  }
}
