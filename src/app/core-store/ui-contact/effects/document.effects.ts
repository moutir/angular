import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { ContactDocumentService } from '../../../core/shared/contact/contact-document.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContactModel } from '../../../shared/model/contact.model';

@Injectable()
export class DocumentEffects extends EffectsAbstract<ContactModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: ContactDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
