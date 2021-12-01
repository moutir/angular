import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SuggestionEventRemove } from '../actions/suggestion-event-remove';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { SuggestionPageService } from '../../../core/shared/suggestion/suggestion-page.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { SuggestionApiService } from '../../../api/shared/suggestion/suggestion-api.service';
import { SuggestionEventVote } from '../actions/suggestion-event-vote';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { PageEventLoadModel } from '../../ui-page/actions/page-event-load-model';

@Injectable()
export class SuggestionEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private confirmService: ConfirmService,
    private suggestionApiService: SuggestionApiService,
    private pageService: SuggestionPageService,
  ) {

  }

  /**
   * Perform API call to remove suggestion
   *
   * @action SuggestionEventRemove
   */
  SuggestionEventRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SuggestionEventRemove>(SuggestionEventRemove.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        'confirm_suggestion_remove_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.suggestion,
          ids: [action.payload.id],
          message: 'notification_suggestion_remove',
          operation: 'remove',
          apiCall: () => this.suggestionApiService.remove(action.payload.id).pipe(
            map(response => {

              if (response === true) {

                // Redirect to list
                this.pageService.redirect(PageTypeEnum.list, null);
              }

              return response;
            }),
          ),
        }),
      );

      return actions;
    }),
  ));

  /**
   * Perform API call to vote for suggestion
   *
   * @action SuggestionEventVote
   */
  SuggestionEventVote$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SuggestionEventVote>(SuggestionEventVote.TYPE),
    switchMap(action => {

      return this
        .suggestionApiService
        .saveVote(action.payload.suggestionId, action.payload.vote)
        .pipe(
          switchMap(response => {

            const actions = [];

            // Notification
            actions.push(
              new RuntimeEventNotification({
                type: response.success ? NotificationTypeEnum.success : NotificationTypeEnum.failure,
                message: response.success ? 'message_suggestion_vote_success' : 'message_suggestion_vote_failure',
              }),
            );

            if (response.success === true) {

              // Reload page model
              actions.push(
                new PageEventLoadModel({
                  entity: this.pageService.getEntity(),
                  id: action.payload.suggestionId,
                }),
              );
            }

            return actions;
          }),
        );
    }),
  ));
}
