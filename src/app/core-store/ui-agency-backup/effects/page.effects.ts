import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { AgencyBackupService } from '../../../core/shared/agency-backup/agency-backup.service';
import { AgencyBackupModel } from '../../../shared/model/agency-backup.model';
import { FormService } from '../../../core/shared/form.service';
import { AgencyBackupPageService } from '../../../core/shared/agency-backup/agency-backup-page.service';

@Injectable()
export class PageEffects extends EffectsAbstract<AgencyBackupModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AgencyBackupPageService,
    protected modelService: AgencyBackupService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AgencyBackupModel): Action {

    return null;
  }
}
