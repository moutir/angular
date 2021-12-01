import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertyUpsert } from '../../data-property/actions/property-upsert';
import { PropertyPageService } from '../../../core/shared/property/property-page.service';
import { PropertyService } from '../../../core/shared/property/property.service';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<PropertyModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: PropertyPageService,
    protected modelService: PropertyService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: PropertyModel): Action {

    return new PropertyUpsert({
      models: [model],
    });
  }
}
