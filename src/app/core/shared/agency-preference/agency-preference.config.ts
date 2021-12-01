import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';

@Injectable()
export class AgencyPreferenceConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.agencyPreference;
  readonly ENTITY_ROUTE_BASE: string = 'agency-preference';
  readonly ICON: string = 'tune';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.optionAgencyPreference,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.agencyPreferenceRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.agencyPreferenceWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.agencyPreferenceReadInformation,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.agencyPreferenceWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof AgencyPreferenceModel> = {
    id: 'id',
  };
}
