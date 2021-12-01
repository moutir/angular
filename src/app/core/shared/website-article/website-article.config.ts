import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class WebsiteArticleConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.websiteArticle;
  readonly ENTITY_ROUTE_BASE: string = 'website-article';
  readonly ICON: string = 'article';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.optionLanguageCommunication,
    RuntimeDataEnum.optionPublicationWebsite,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.websiteContentRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.websiteContentWrite;
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.websiteArticleReadGeneral,
    PageTabEnum.websiteArticleReadContent,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.websiteArticleWriteGeneral,
  ];
  readonly SAVE_VALIDATION_MAPPING: Dictionary<keyof WebsiteArticleModel> = {
    main_url: 'websiteUrl',
  };
}
