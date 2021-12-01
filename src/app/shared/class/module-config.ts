import { EntityEnum } from '../enum/entity.enum';
import { RuntimeDataEnum } from '../enum/runtime-data.enum';
import { PermissionEnum } from '../enum/permission.enum';
import { PageTabEnum } from '../enum/page-tab.enum';
import { KeyValueType } from '../type/key-value.type';

export class ModuleConfig {

  /**
   * Module's main entity
   */
  readonly ENTITY: EntityEnum = EntityEnum.loading;

  /**
   * Module's entity route base
   */
  readonly ENTITY_ROUTE_BASE: string = '';

  /**
   * Module's icon
   */
  readonly ICON: string = '';

  /**
   * Module's required data regardless of the page
   */
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [];

  /**
   * Module's entity permissions
   */
  readonly PERMISSION_READ: PermissionEnum|null = null;
  readonly PERMISSION_WRITE: PermissionEnum|null = null;

  /**
   * Module's supported tab UIDs (index matters for usage in components templates)
   */
  readonly READ_TAB_UIDS: PageTabEnum[] = [];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [];

  /**
   * Activate support for page header buttons // TODO[later] Remove fields once fully on Angular
   */
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = false;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = false;
  readonly IS_SUPPORTING_PAGE_SEARCH: boolean = false;

  /**
   * Model save validation mapping "BE API error attribute => FE Model attribute"
   */
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, string> = {};
}
