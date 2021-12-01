import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { SectorModel } from '../../../shared/model/sector.model';
import { KeyValueType } from '../../../shared/type/key-value.type';

@Injectable()
export class SectorConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.sector;
  readonly ENTITY_ROUTE_BASE: string = 'sector';
  readonly ICON: string = 'location_searching';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionIsArchive01,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.sectorRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.sectorWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.sectorReadInformation,
    PageTabEnum.sectorReadPropertySale,
    PageTabEnum.sectorReadPropertyRent,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.sectorWriteRequired,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof SectorModel> = {
    '/data/attributes/name': 'name',
  };
}
