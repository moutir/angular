import { Injectable } from '@angular/core';

import { ModuleConfig } from '../../../shared/class/module-config';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { TaskModel } from '../../../shared/model/task.model';

@Injectable()
export class TaskConfig extends ModuleConfig {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  readonly ENTITY: EntityEnum = EntityEnum.task;
  readonly ENTITY_ROUTE_BASE: string = 'tasks';
  readonly ICON: string = 'check_circle_outline';
  readonly REQUIRED_DATA: RuntimeDataEnum[] = [
    RuntimeDataEnum.permissions,
    RuntimeDataEnum.settings,
    RuntimeDataEnum.feature,
    RuntimeDataEnum.userPreference,
    RuntimeDataEnum.contactTypeByGroup,
    RuntimeDataEnum.optionBrokerColleague,
    RuntimeDataEnum.optionBrokerSell,
    RuntimeDataEnum.optionBrokerRent,
    RuntimeDataEnum.featureTask,
    RuntimeDataEnum.optionTaskType,
    RuntimeDataEnum.optionTaskStatus,
    RuntimeDataEnum.optionReminderAt,
    RuntimeDataEnum.optionAgenda,
  ];
  readonly PERMISSION_READ: PermissionEnum = PermissionEnum.taskRead;
  readonly PERMISSION_WRITE: PermissionEnum = PermissionEnum.taskWrite;
  readonly READ_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.taskReadGeneral,
  ];
  readonly WRITE_TAB_UIDS: PageTabEnum[] = [
    PageTabEnum.taskWriteGeneral,
,
  ];
  readonly IS_SUPPORTING_PAGE_CANCEL: boolean = true;
  readonly IS_SUPPORTING_PAGE_ADD: boolean = true;
  readonly SAVE_VALIDATION_MAPPING: KeyValueType<string, keyof TaskModel> = {
    task_type: 'typeId',
    title: 'title',
    due_date: 'startDate',
    due_time: 'startTime',
    reminder_time: 'reminderAtId',
  };
}
