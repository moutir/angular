import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CustomAttributeEventRemove } from '../actions/custom-attribute-event-remove';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { CustomAttributeApiService } from '../../../api/shared/custom-attribute/custom-attribute-api.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { CustomAttributePageService } from '../../../core/shared/custom-attribute/custom-attribute-page.service';

@Injectable()
export class CustomAttributeEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private confirmService: ConfirmService,
    private customAttributeApiService: CustomAttributeApiService,
    private pageService: CustomAttributePageService,
  ) {

  }

  /**
   * Perform API call to remove customAttribute
   *
   * @action CustomAttributeEventRemove
   */
  CustomAttributeEventRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<CustomAttributeEventRemove>(CustomAttributeEventRemove.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        'confirm_custom_attribute_remove_singular',
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
          entity: EntityEnum.customAttribute,
          ids: [action.payload.id],
          message: 'notification_custom_attribute_remove',
          operation: 'remove',
          apiCall: () => this.customAttributeApiService.remove(action.payload.id).pipe(
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
}
