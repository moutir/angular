import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { FormService } from '../../../core/shared/form.service';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { EmailTemplatePageService } from '../../../core/shared/email-template/email-template-page.service';
import { EmailTemplateService } from '../../../core/shared/email-template/email-template.service';
import { EmailTemplateUpsert } from '../../data-email-template/actions/email-template.upsert';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { EmailTemplateOptionsInterface } from '../../../shared/interface/email-template-options.interface';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { EntityEventOperationDone } from '../../ui-entity/actions/entity-event-operation-done';

@Injectable()
export class PageEffects extends EffectsAbstract<EmailTemplateModel, EmailTemplateOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: EmailTemplatePageService,
    protected modelService: EmailTemplateService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  PageEventClickMenuItem$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickMenuItem>(PageEventClickMenuItem.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      // Remove
      if (action.payload.menuItem.id === 'remove') {

        // Request for email template remove
        this.modelService.remove(model.id);
      }

      return [];
    }),
  ));

  /**
   * Redirect to list once operation 'remove' done
   *
   * @action EntityEventOperationDone
   */
  EntityEventOperationDoneRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventOperationDone>(EntityEventOperationDone.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    filter(action => action.payload.operation === 'remove'),
    switchMap(action => zip(
      of(action),
      this.pageService.selectHeader(),
    )),
    switchMap(([action, header]) => {

      // Can deactivate page
      this.pageService.setCanDeactivate(true);

      // Redirect to list
      this.pageService.redirect(PageTypeEnum.list, null);

      return [];
    })),
  );

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: EmailTemplateModel): Action {

    return new EmailTemplateUpsert({
      models: [model],
    });
  }
}
