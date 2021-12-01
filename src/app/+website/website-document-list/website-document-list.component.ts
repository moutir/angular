import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { WebsiteDocumentService } from '../../core/shared/website/website-document.service';
import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { WebsiteModel } from '../../shared/model/website.model';
import { MimeTypeEnum } from '../../shared/enum/mime-type.enum';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-website-document-list',
  templateUrl: './website-document-list.component.html',
})
export class WebsiteDocumentListComponent
  extends DocumentListComponentAbstract<WebsiteModel> implements OnChanges {

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [MimeTypeEnum.image],
    maxFileSize: 10,
    maxFileCount: 30,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.websiteImage,
    entity: <EntityEnum>'cms',
    entityId: '',
    description: 'label_website_image_uploader_description',
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
    protected documentService: WebsiteDocumentService,
  ) {

    super(
      documentService,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.model && this.model && !this.uploadStrategy.entityId) {

      this.uploadStrategy = {
        ...this.uploadStrategy,
        entityId: this.model.id,
      };
    }
  }
}
