import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { AgencyProfileGeneralDocumentService } from '../../../core/shared/agency-profile/agency-profile-general-document.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyModel } from '../../../shared/model/agency.model';

@Injectable()
export class GeneralDocumentEffects extends EffectsAbstract<AgencyModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: AgencyProfileGeneralDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
