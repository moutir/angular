import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-document/effects.abstract';
import { WebsiteArticleDocumentService } from '../../../core/shared/website-article/website-article-document.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';

@Injectable()
export class DocumentEffects extends EffectsAbstract<WebsiteArticleModel> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: WebsiteArticleDocumentService,
  ) {

    super(actions$, runtimeService, documentService);
  }
}
