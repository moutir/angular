import { Component, Input } from '@angular/core';

import { TaskModel } from '../../shared/model/task.model';
import { TaskService } from '../../core/shared/task/task.service';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-task-table-row',
  templateUrl: './task-table-row.component.html',
  styleUrls: ['./task-table-row.component.scss'],
})
export class TaskTableRowComponent extends TableRowComponentAbstract {

  /**
   * Task to display
   */
  @Input() task: TaskModel = new TaskModel();

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Constants
   */
  readonly PERMISSION_TASK_DELETE: PermissionEnum = PermissionEnum.taskDelete;

  /**
   * Maximum number of contacts to display per cell
   */
  contactMax: number = 2;

  /**
   * Constructor
   */
  constructor(
    private taskService: TaskService,
  ) {

    super();
  }

  /**
   * Clicked on button to toggle importance
   */
  onClickToggleImportant(isImportant: boolean): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.taskService.updateImportance(this.task.id, isImportant);
  }

  /**
   * Clicked on button to toggle finished
   */
  onClickToggleFinished(isFinished: boolean): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.taskService.updateFinished(this.task.id, isFinished);
  }

  /**
   * Clicked on delete button
   */
  onClickDelete(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.taskService.remove(this.task.id);
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.task;
  }
}
