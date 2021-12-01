import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WebsiteArticleModelGeneralAdapterStrategy } from '../../core/shared/website-article/website-article-model-general-adapter.strategy';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { WebsiteArticleOptionsInterface } from '../../shared/interface/website-article-options.interface';
import { DocumentModel } from '../../shared/model/document.model';

@Component({
  selector: 'app-website-article-form-general',
  templateUrl: './website-article-form-general.component.html',
  styleUrls: ['./website-article-form-general.component.scss'],
})
export class WebsiteArticleFormGeneralComponent extends FormComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.websiteArticleWriteGeneral;

  /**
   * Documents
   */
  documents: DocumentModel[] = [];
  documentsHash: string = '';

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: WebsiteArticleModelGeneralAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Model changed
    if (!!changes.model) {

      const documentsHash = JSON.stringify(this.model.documents);

      if (documentsHash !== this.documentsHash) {

        this.documents = this.model.documents;
        this.documentsHash = documentsHash;
      }
    }
  }
}
