import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { WebsiteArticleConfig } from './website-article.config';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { WebsiteArticleService } from './website-article.service';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { WebsiteArticleOptionsInterface } from '../../../shared/interface/website-article-options.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

@Injectable()
export class WebsiteArticlePageService extends PageServiceAbstract<
  WebsiteArticleModel,
  WebsiteArticleOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: WebsiteArticleConfig,
    protected modelService: WebsiteArticleService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * Return the tab UID for a write-content tab in the given language
   */
  getWriteContentTabUid(language: LanguageEnum): PageTabEnum {

    return <PageTabEnum>[PageTabEnum.websiteArticleWriteContent, language].join('#');
  }

  /**
   * @inheritDoc
   */
  selectTabUids(): Observable<PageTabEnum[]> {

    return zip(
      this.selectType(),
      this.runtimeService.selectAvailableLanguageIds(),
    )
    .pipe(
      map(([type, availableLanguageIds]) => {

        if (type === PageTypeEnum.read) {

          return this.getReadTabUids();
        }

        if (type === PageTypeEnum.write) {

          const tabUids = this.getWriteTabUids();

          availableLanguageIds.forEach(languageId => tabUids.push(
            this.getWriteContentTabUid(languageId) as PageTabEnum,
          ));

          return tabUids;
        }

        return [];
      }),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, WebsiteArticleOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (
        options: RuntimeOptionsInterface,
      ): WebsiteArticleOptionsInterface => {

        return {
          website: options.publicationWebsite,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: WebsiteArticleModel): string {

    return model.title || 'page_header_websiteArticle';
  }
}
