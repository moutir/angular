import { Component } from '@angular/core';

import { WebsiteArticleDocumentService } from '../../core/shared/website-article/website-article-document.service';
import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { MimeTypeEnum } from '../../shared/enum/mime-type.enum';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-website-article-document-list',
  templateUrl: './website-article-document-list.component.html',
  styleUrls: ['./website-article-document-list.component.scss'],
})
export class WebsiteArticleDocumentListComponent extends DocumentListComponentAbstract<WebsiteArticleModel> {

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [MimeTypeEnum.image],
    maxFileSize: 10,
    maxFileCount: 15,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.websiteArticleImage,
    entity: EntityEnum.cmsArticle,
    entityId: '',
    description: 'label_website_article_image_uploader_description',
  };

  /**
   * Document manager strategy
   */
  documentManagerStrategy: DocumentManagerStrategyInterface = {
    inputs: [
      {
        name: 'tag',
        type: 'text',
        label: 'label_tag',
        default: '',
      },
    ],
    options: {},
  };

  /**
   * Constructor
   */
  constructor(
    protected documentService: WebsiteArticleDocumentService,
  ) {

    super(
      documentService,
    );
  }

}
