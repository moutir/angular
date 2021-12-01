import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { CustomAttributeUpsert } from '../../data-custom-attribute/actions/custom-attribute-upsert';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { CustomAttributeSearchlistService } from '../../../core/shared/custom-attribute/custom-attribute-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { CustomAttributeSearchModel } from '../../../shared/model/custom-attribute-search.model';
import { CustomAttributeSearchOptionsInterface } from '../../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeService } from '../../../core/shared/custom-attribute/custom-attribute.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  CustomAttributeModel,
  CustomAttributeSearchModel,
  CustomAttributeSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: CustomAttributeService,
    protected searchlistService: CustomAttributeSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: CustomAttributeModel[]): CustomAttributeUpsert {

    return new CustomAttributeUpsert({
      models: models,
    });
  }
}
