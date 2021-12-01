import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { EmailTemplateEventRemove } from '../actions/email-template-event-remove';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EmailTemplateApiService } from '../../../api/shared/email-template/email-template-api.service';

@Injectable()
export class EmailTemplateEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private confirmService: ConfirmService,
    private emailTemplateApiService: EmailTemplateApiService,
  ) {

  }

  /**
   * Perform API call to remove email template
   *
   * @action EmailTemplateEventRemove
   */
  EmailTemplateEventRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailTemplateEventRemove>(EmailTemplateEventRemove.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        'confirm_email_template_remove_singular',
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
          entity: EntityEnum.emailTemplate,
          ids: [action.payload.emailTemplateId],
          message: 'notification_email_template_remove',
          operation: 'remove',
          apiCall: () => this.emailTemplateApiService.remove(action.payload.emailTemplateId),
        }),
      );

      return actions;
    }),
  ));
}
