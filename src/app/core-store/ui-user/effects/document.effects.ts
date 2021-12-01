import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { UserModel } from '../../../shared/model/user.model';
import { UserDocumentService } from '../../../core/shared/user/user-document.service';

@Injectable()
export class DocumentEffects extends EffectsAbstract<UserModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: UserDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
