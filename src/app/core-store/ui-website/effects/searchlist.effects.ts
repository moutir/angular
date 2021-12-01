import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteService } from '../../../core/shared/website/website.service';
import { WebsiteModel } from '../../../shared/model/website.model';
import { WebsiteSearchModel } from '../../../shared/model/website-search.model';
import { WebsiteSearchlistService } from '../../../core/shared/website/website-searchlist.service';
import { WebsiteUpsert } from '../../data-website/actions/website-upsert';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  WebsiteModel,
  WebsiteSearchModel,
  {}
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: WebsiteService,
    protected searchlistService: WebsiteSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): WebsiteUpsert {

    return new WebsiteUpsert({
      models: <WebsiteModel[]>models,
    });
  }
}
