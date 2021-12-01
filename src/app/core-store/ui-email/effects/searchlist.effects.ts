import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { EmailUpsert } from '../../data-email/actions/email-upsert';
import { EmailModel } from '../../../shared/model/email.model';
import { EmailSearchlistService } from '../../../core/shared/email/email-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailSearchModel } from '../../../shared/model/email-search.model';
import { EmailSearchOptionsInterface } from '../../../shared/interface/email-search-options.interface';
import { EmailService } from '../../../core/shared/email/email.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  EmailModel,
  EmailSearchModel,
  EmailSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: EmailService,
    protected searchlistService: EmailSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: EmailModel[]): EmailUpsert {

    return new EmailUpsert({
      models: models,
    });
  }
}
