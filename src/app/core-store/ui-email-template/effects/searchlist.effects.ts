import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailTemplateService } from '../../../core/shared/email-template/email-template.service';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';
import { EmailTemplateSearchModel } from '../../../shared/model/email-template-search.model';
import { EmailTemplateSearchlistService } from '../../../core/shared/email-template/email-template-searchlist.service';
import { EmailTemplateUpsert } from '../../data-email-template/actions/email-template.upsert';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  EmailTemplateModel,
  EmailTemplateSearchModel,
  {}
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: EmailTemplateService,
    protected searchlistService: EmailTemplateSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): EmailTemplateUpsert {

    return new EmailTemplateUpsert({
      models: <EmailTemplateModel[]>models,
    });
  }
}
