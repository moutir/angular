import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { WebsiteArticlePageService } from '../../../core/shared/website-article/website-article-page.service';
import { WebsiteArticleService } from '../../../core/shared/website-article/website-article.service';
import { WebsiteArticleUpsert } from '../../data-website-article/actions/website-article-upsert';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { FormService } from '../../../core/shared/form.service';
import { WebsiteArticleOptionsInterface } from '../../../shared/interface/website-article-options.interface';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { DocumentEventLoad } from '../../ui-document/actions/document-event-load';
import { WebsiteArticleDocumentService } from '../../../core/shared/website-article/website-article-document.service';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class PageEffects extends EffectsAbstract<WebsiteArticleModel, WebsiteArticleOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: WebsiteArticlePageService,
    protected modelService: WebsiteArticleService,
    private documentService: WebsiteArticleDocumentService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Load documents on page model load
   *
   * @action PageEventLoadModelSuccess
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectType(),
    )),
    switchMap(([action, type]) => {

      const uid = type === PageTypeEnum.read ?
        PageTabEnum.websiteArticleReadGeneral : PageTabEnum.websiteArticleWriteGeneral;

      return [

        new DocumentEventLoad({
          uid: this.documentService.getUid(uid),
          model: action.payload.model,
        }),
      ];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected filterDocumentUid(uid: string): boolean {

    return [
      this.documentService.getUid(PageTabEnum.websiteArticleReadGeneral),
      this.documentService.getUid(PageTabEnum.websiteArticleWriteGeneral),
    ].indexOf(uid) > -1;
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: WebsiteArticleModel): Action {

    return new WebsiteArticleUpsert({
      models: [model],
    });
  }
}
