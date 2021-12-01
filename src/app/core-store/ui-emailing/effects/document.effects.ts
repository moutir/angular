import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { EmailingDocumentService } from '../../../core/shared/emailing/emailing-document.service';

@Injectable()
export class DocumentEffects extends EffectsAbstract<EmailingModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: EmailingDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: EmailingModel[]): Action {

    return null;
  }
}
