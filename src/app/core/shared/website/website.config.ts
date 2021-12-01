import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { WebsiteModel } from '../../../shared/model/website.model';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class WebsiteConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.website;
  readonly ENTITY_ROUTE_BASE: string = 'website';
  readonly ICON: string = 'public';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionWebsiteLayout,
    RuntimeDataEnum.optionWebsiteTemplate,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionLanguageCommunication,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.websiteConfigRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.websiteConfigWrite;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.websiteReadGeneral,
    PageTabEnum.websiteReadStyle,
    PageTabEnum.websiteReadPhoto,
    PageTabEnum.websiteReadContent,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.websiteWriteGeneral,
    PageTabEnum.websiteWriteStyle,
    PageTabEnum.websiteWritePhoto,
  ];
  readonly SAVE_VALIDATION_MAPPING: Dictionary<keyof WebsiteModel> = {
    url: 'url',
    website_layout: 'layoutId',
    template: 'templateId',
    label_template: 'templateId',
    default_lang: 'defaultLanguageId',
    label_team_members: <keyof WebsiteModel>'brokerIds',
    label_language_default_lang: 'defaultLanguageId',
    label_language_lang_available: 'availableLanguageIds',
    lang_available: 'availableLanguageIds',
    alternative_domain: 'alternativeDomain',
    facebook_appid: 'facebookAppId',
    label_facebook_appid: 'facebookAppId',
    google_analytics_appid: 'googleAnalyticsAppId',
    active: 'isActive',
    is_internal: 'isInternal',
    activate_fisher: 'isActiveFisher',
    site_background_colour: 'styleSiteBgColour',
    primary_background_colour: 'stylePrimaryBgColour',
    primary_background_flat_colour: 'stylePrimaryBgFlatColour',
    secondary_background_colour: 'styleSecondaryBgColour',
    block_background_colour: 'styleBlockBgColour',
    footer_background_colour: 'styleFooterBgColour',
    primary_font_colour: 'stylePrimaryFontColour',
    secondary_font_colour: 'styleSecondaryFontColour',
    header_footer_font_colour: 'styleHeaderFooterFontColour',
    details_title_background_colour: 'styleDetailsTitleBgColour',
    details_title_background_shadow_colour: 'styleDetailsTitleBgShadowColour',
    details_amenities_font_colour: 'styleDetailsAmenitiesFontColour',
    details_top_bar_colour: 'styleDetailsTopBarColour',
  };
}
