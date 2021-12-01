import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { AgendaService } from '../../../core/shared/agenda/agenda.service';
import { AgendaPageService } from '../../../core/shared/agenda/agenda-page.service';
import { AgendaModel } from '../../../shared/model/agenda.model';
import { AgendaOptionsInterface } from '../../../shared/interface/agenda-options.interface';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<AgendaModel, AgendaOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AgendaPageService,
    protected modelService: AgendaService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AgendaModel): Action {

    return null;
  }
}
