import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { AgencyProfileImageDocumentService } from '../../../core/shared/agency-profile/agency-profile-image-document.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyModel } from '../../../shared/model/agency.model';

@Injectable()
export class ImageDocumentEffects extends EffectsAbstract<AgencyModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: AgencyProfileImageDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
