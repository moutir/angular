import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { PortalModel } from '../../../shared/model/portal.model';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class PortalConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.portal;
  readonly ICON: string = 'cast';
  readonly ENTITY_ROUTE_BASE: string = 'portal';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.featurePortal,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionPortalLanguage,
    RuntimeDataEnum.optionCountryByCode,
    RuntimeDataEnum.optionPortalSendLeadCopy,
    RuntimeDataEnum.optionPortalList,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionPublicationWebsite,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyGatewayRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.agencyGatewayRead;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.portalReadInformation,
    PageTabEnum.portalReadOutput,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.portalWriteRequired,
    PageTabEnum.portalWriteContact,
    PageTabEnum.portalWriteTechnical,
    PageTabEnum.portalWriteSettings,
  ];
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof PortalModel> = {
    max_pictures: 'maxPictures',
    gateway_label: 'label',
    gateway: 'portalId',
    ftp_login: 'ftpLogin',
    ftp_password: 'ftpPassword',
    marketing_monthly: 'marketingMonthly',
    marketing_price: 'marketingPrice',
    ftp_host: 'ftpHost',
    ftp_port: 'ftpPort',
    ftp_attempts: 'ftpAttempts',
    ftp_pasv: 'ftpPasv',
    language: 'languageCode',
    publication: 'publicationSites',
    gateway_agency_phone_sales: <keyof PortalModel>'agencyPhoneSales',
    gateway_agency_phone_rentals: <keyof PortalModel>'agencyPhoneRentals',
    gateway_agency_email_sales: <keyof PortalModel>'agencyEmailSales',
    gateway_agency_email_rentals: <keyof PortalModel>'agencyEmailRentals',
    gateway_agency_id: <keyof PortalModel>'portalAgencyId',
    gateway_agency_name: <keyof PortalModel>'agencyName',
    gateway_agency_city: <keyof PortalModel>'agencyCity',
    gateway_agency_country: <keyof PortalModel>'agencyCountry',
    gateway_agency_street: <keyof PortalModel>'agencyStreet',
    gateway_agency_zip: <keyof PortalModel>'agencyZip',
    gateway_agency_fax: <keyof PortalModel>'agencyFax',
    agency_website_id: 'agencyWebsiteId',
  };

}
