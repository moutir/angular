import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ProcessService } from '../../../core/shared/process/process.service';
import { ProcessPageService } from '../../../core/shared/process/process-page.service';
import { ProcessModel } from '../../../shared/model/process.model';
import { ProcessUpsert } from '../../data-process/actions/process-upsert';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<ProcessModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ProcessPageService,
    protected modelService: ProcessService,
    protected propertySearchlistService: PropertySearchlistService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: ProcessModel): Action {

    return new ProcessUpsert({
      models: [model],
    });
  }
}
