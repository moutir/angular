import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { WebsiteDocumentService } from '../../../core/shared/website/website-document.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteModel } from '../../../shared/model/website.model';

@Injectable()
export class DocumentEffects extends EffectsAbstract<WebsiteModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: WebsiteDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
