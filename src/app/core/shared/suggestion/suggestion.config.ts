import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class SuggestionConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.suggestion;
  readonly ENTITY_ROUTE_BASE: string = 'suggestion';
  readonly ICON: string = 'batch_prediction';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.settings,
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.optionSuggestionStatus,
    RuntimeDataEnum.optionSuggestionTag,
    RuntimeDataEnum.optionSuggestionVote,
    RuntimeDataEnum.optionAccountType,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.suggestionRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.suggestionWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.suggestionReadInformation,
    PageTabEnum.suggestionReadVote,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.suggestionWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, string> = {
    complexity: 'complexity',
    status: 'statusId',
    clientBenefit: 'clientBenefit',
    realforceBenefit: 'realforceBenefit',
    images: 'images',
    'images[{i}].url': 'images.{i}.url',
    'images[{i}].label': 'images.{i}.label',
    contents: 'contents',
    'contents[{i}].title': 'contents.{i}.title',
    'contents[{i}].problem': 'contents.{i}.problem',
    'contents[{i}].solution': 'contents.{i}.solution',
    tags: 'tags',
  };
}
