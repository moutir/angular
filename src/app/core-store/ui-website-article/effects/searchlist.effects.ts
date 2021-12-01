import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteArticleService } from '../../../core/shared/website-article/website-article.service';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { WebsiteArticleSearchModel } from '../../../shared/model/website-article-search.model';
import { WebsiteArticleSearchlistService } from '../../../core/shared/website-article/website-article-searchlist.service';
import { WebsiteArticleUpsert } from '../../data-website-article/actions/website-article-upsert';
import { WebsiteArticleSearchOptionsInterface } from '../../../shared/interface/website-article-search-options.interface';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  WebsiteArticleModel,
  WebsiteArticleSearchModel,
  WebsiteArticleSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: WebsiteArticleService,
    protected searchlistService: WebsiteArticleSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): WebsiteArticleUpsert {

    return new WebsiteArticleUpsert({
      models: <WebsiteArticleModel[]>models,
    });
  }
}
