import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Params, Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { TaskModel } from '../../../shared/model/task.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { TaskConfig } from './task.config';
import { TaskService } from './task.service';
import { TaskOptionsInterface } from '../../../shared/interface/task-options.interface';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { TaskEventEntitiesFromRoute } from '../../../core-store/ui-task/actions/task-event-entities-from-route';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class TaskPageService extends PageServiceAbstract<TaskModel, TaskOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: TaskConfig,
    protected modelService: TaskService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * Set entities from query params
   */
  entitiesFromRoute(queryParams: Params): void {

    this.store$.dispatch(
      new TaskEventEntitiesFromRoute({ queryParams }),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, TaskOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ): TaskOptionsInterface => {

        return <TaskOptionsInterface>{
          type: options.taskType,
          reminderAt: options.reminderAt,
          agenda: options.agenda,
          broker: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: TaskModel, language: LanguageEnum): string {

    return model.title || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenu(): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      this.getSelectorModel(),
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
        model: TaskModel,
      ): MenuInterface => {

        const items: MenuItemInterface[] = [];
        const hasClients = model.contacts.length > 0;

        // Read page with write permission
        if (type === PageTypeEnum.read && permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1) {

          if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

            // Send email
            items.push({
              id: OperationEnum.taskSendEmail,
              label: 'label_email_send',
              isEnabled: hasClients === true,
              icon: 'email',
              tooltip: hasClients === false ? 'tooltip_task_has_no_clients' : '',
              items: [],
            });
          }

          if (permissions.indexOf(PermissionEnum.contactWrite) > -1) {

            // Add to contacts basket
            items.push({
              id: OperationEnum.taskAddBasket,
              label: 'label_add_to_contact_basket',
              isEnabled: hasClients === true,
              icon: 'add_shopping_cart',
              tooltip: hasClients === false ? 'tooltip_task_has_no_clients' : '',
              items: [],
            });
          }

          // Mark as progress/finished
          items.push({
            id: OperationEnum.taskMarkFinish,
            label: model.isFinished ? 'label_mark_as_progress' : 'label_mark_as_done',
            isEnabled: model.isSystemGenerated === false,
            icon: model.isFinished ? 'radio_button_unchecked' : 'check_circle_outline',
            tooltip: model.isSystemGenerated === true ? 'tooltip_task_readonly_reason_system' : '',
            items: [],
          });

          // Remove
          items.push({
            id: OperationEnum.taskRemove,
            label: 'label_remove',
            icon: 'delete_forever',
            tooltip: model.isSystemGenerated === true ? 'tooltip_task_readonly_reason_system' : 'label_task_delete',
            isEnabled: model.isSystemGenerated === false,
            items: [],
          });
        }

        return { items };
      },
    );
  }
}
