import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { EmailPageService } from '../../../core/shared/email/email-page.service';
import { EmailService } from '../../../core/shared/email/email.service';
import { EmailUpsert } from '../../data-email/actions/email-upsert';
import { EmailModel } from '../../../shared/model/email.model';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<EmailModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: EmailPageService,
    protected modelService: EmailService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: EmailModel): Action {

    return new EmailUpsert({
      models: [model],
    });
  }
}
