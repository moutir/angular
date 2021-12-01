import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { WebsiteArticlePageService } from '../../core/shared/website-article/website-article-page.service';
import { WebsiteArticleOptionsInterface } from '../../shared/interface/website-article-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WebsiteArticleDocumentService } from '../../core/shared/website-article/website-article-document.service';
import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';

@Component({
  selector: 'app-website-article-page-read',
  templateUrl: './website-article-page-read.component.html',
  styleUrls: ['./website-article-page-read.component.scss'],
})
export class WebsiteArticlePageReadComponent extends PageReadComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleOptionsInterface
> {

  /**
   * State observables
   */
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;
  currentLanguageLabel$: Observable<string>;
  isLoadingPhotos$: Observable<boolean>;

  /**
   * Images
   */
  images: GalleryImageInterface[] = [];

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.websiteArticleReadGeneral;
  readonly PAGE_TAB_CONTENT: PageTabEnum = PageTabEnum.websiteArticleReadContent;

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsiteArticlePageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private documentService: WebsiteArticleDocumentService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.currentLanguageLabel$ = this.runtimeService.selectCurrentLanguageLabel();
    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
    this.isLoadingPhotos$ = this.documentService.selectLoading(this.documentService.register(this.PAGE_TAB_GENERAL));
  }

  /**
   * Next model
   */
  protected onNextModel(model: WebsiteArticleModel): void {

    super.onNextModel(model);

    // Images
    this.images = model.documents.map(document => {

      return {
        title: document.tag || document.name,
        url: document.photoLargeURL,
        thumbnailUrl: document.photoLargeURL,
      };
    });
  }
}
