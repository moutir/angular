import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { zip } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { TaskModel } from '../../shared/model/task.model';
import { TaskSearchOptionsInterface } from '../../shared/interface/task-search-options.interface';
import { TaskSearchModel } from '../../shared/model/task-search.model';
import { TaskSearchlistService } from '../../core/shared/task/task-searchlist.service';
import { TaskService } from '../../core/shared/task/task.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { EventContextModelInterface } from '../../shared/interface/event-context-model.interface';
import { TaskConfig } from '../../core/shared/task/task.config';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { ContactService } from '../../core/shared/contact/contact.service';

@Component({
  selector: 'app-task-searchlist',
  templateUrl: './task-searchlist.component.html',
  styleUrls: ['./task-searchlist.component.scss'],
})
export class TaskSearchlistComponent extends SearchlistComponentAbstract<
  TaskModel,
  TaskSearchModel,
  TaskSearchOptionsInterface
> {

  /**
   * List of operation names that have a subform
   */
  private operationSubform: string[] = [];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: TaskConfig,
    protected searchlistService: TaskSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected taskService: TaskService,
    protected contactService: ContactService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    zip(
      this.selection$,
      this.taskService.selectTasks(),
    ).pipe(take(1))
    .subscribe(([selection, tasks]) => {

      // Contact IDs for each selected tasks
      const contactIds = [];

      selection.ids.forEach(id => {

        const task = tasks[id] || new TaskModel();

        if (task.contacts.length > 0) {

          // Task's first contact ID
          contactIds.push(task.contacts[0].id);
        }
      });

      // Operations that trigger instantly
      switch (menuItem.id) {

        case OperationEnum.taskSendEmail:
          this.contactService.sendEmail(contactIds);
          break;

        case OperationEnum.taskAddBasket:
          this.contactService.addBasket(contactIds);
          break;
      }

      // Operation with subform
      if (this.operationSubform.indexOf(menuItem.id) > -1) {

        return;
      }

      // Reset current operation
      this.resetOperation();
    });
  }

  /**
   * @inheritDoc
   */
  onContextModel(event: EventContextModelInterface<TaskModel>): void {

    return;
  }
}
