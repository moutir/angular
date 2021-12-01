import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import { TaskModel } from '../../../shared/model/task.model';
import { TaskUpsert } from '../../data-task/actions/task-upsert';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { TaskApiService } from '../../../api/shared/task/task-api.service';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { TaskEventChangeImportant } from '../actions/task-event-change-important';
import { TaskEventChangeFinished } from '../actions/task-event-change-finished';
import { TaskEventDelete } from '../actions/task-event-delete';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { TaskService } from '../../../core/shared/task/task.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { TaskPageService } from '../../../core/shared/task/task-page.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class TaskEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private taskApiService: TaskApiService,
    private confirmService: ConfirmService,
    private taskService: TaskService,
    private pageService: TaskPageService,
  ) {

  }

  /**
   * Perform API call to change task important value
   *
   * @action TaskEventChangeImportant
   */
  TaskEventChangeImportant$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<TaskEventChangeImportant>(TaskEventChangeImportant.TYPE),
    switchMap(action => zip(of(action), this.taskService.select(action.payload.taskId))),
    mergeMap(([action, task]) => {

      // No task found or value did not change
      if (!task || action.payload.isImportant === task.isImportant) {

        return [];
      }

      const taskUpdated = new TaskModel();
      taskUpdated.id = action.payload.taskId;
      taskUpdated.isImportant = action.payload.isImportant;

      return concat(

        // Optimistic update
        of(new TaskUpsert({
          models: [taskUpdated],
        })),

        // API call
        this
          .taskApiService
          .updateImportance(action.payload.taskId, action.payload.isImportant)
          .pipe(

            // Success
            switchMap(response => {

              if (response.success === false) {

                return [

                  // Notification
                  new RuntimeEventNotification({
                    type: NotificationTypeEnum.failure,
                    message: 'notification_rollback',
                  }),

                  // Rollback
                  task === null ? null : new TaskUpsert({
                    models: [task],
                  }),
                ];
              }

              return [

                new EntityEventChanged({
                  entity: EntityEnum.task,
                  ids: [action.payload.taskId],
                }),

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: 'notification_task_update_importance_success',
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '22', error: error }),

              // Rollback
              task === null ? null : new TaskUpsert({
                models: [task],
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform API call to change task state finished
   *
   * @action TaskEventChangeFinished
   */
  TaskEventChangeFinished$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<TaskEventChangeFinished>(TaskEventChangeFinished.TYPE),
    switchMap(action => zip(of(action), this.taskService.select(action.payload.taskId))),
    mergeMap(([action, task]) => {

      // No task found or value did not change
      if (!task || action.payload.isFinished === task.isFinished) {

        return [];
      }

      const taskUpdated = task.clone<TaskModel>();
      taskUpdated.isFinished = action.payload.isFinished;

      return concat(

        // Optimistic update
        of(new TaskUpsert({
          models: [taskUpdated],
        })),

        // API call
        this
          .taskApiService
          .updateFinished(action.payload.taskId, action.payload.isFinished)
          .pipe(

            // Success
            switchMap(response => {

              if (response.success === false) {

                return [

                  // Notification
                  new RuntimeEventNotification({
                    type: NotificationTypeEnum.failure,
                    message: 'notification_rollback',
                  }),

                  // Rollback
                  task === null ? null : new TaskUpsert({
                    models: [task],
                  }),
                ];
              }

              return [

                new EntityEventChanged({
                  entity: EntityEnum.task,
                  ids: [action.payload.taskId],
                }),

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: 'notification_task_update_finished_success',
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '23', error: error }),

              // Rollback
              task === null ? null : new TaskUpsert({
                models: [task],
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform API call to delete task
   *
   * @action TaskEventDelete
   */
  TaskEventDelete$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<TaskEventDelete>(TaskEventDelete.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message('label_confirm_delete_task'),
      this.pageService.selectType(),
    )),
    mergeMap(([action, isValid, type]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.task,
          ids: [action.payload.taskId],
          message: 'notification_task_remove',
          operation: 'remove',
          apiCall: () => this.taskApiService.delete(action.payload.taskId).pipe(
            map(response => {

              if (response.success === false) {

                return;
              }

              if (type === PageTypeEnum.list) {

                return response;
              }

              // Redirect to list
              this.pageService.redirect(PageTypeEnum.list, null);

              return response;
            }),
          ),
        }),
      );

      return actions;
    }),
  ));
}
