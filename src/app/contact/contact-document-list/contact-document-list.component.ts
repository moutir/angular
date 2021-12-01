import { Component } from '@angular/core';

import { ContactDocumentService } from '../../core/shared/contact/contact-document.service';
import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { ContactModel } from '../../shared/model/contact.model';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-contact-document-list',
  templateUrl: './contact-document-list.component.html',
})
export class ContactDocumentListComponent extends DocumentListComponentAbstract<ContactModel> {

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [],
    maxFileSize: 30,
    maxFileCount: 40,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.contactDocument,
    entity: EntityEnum.contact,
    entityId: '',
    description: '',
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
    protected documentService: ContactDocumentService,
  ) {

    super(
      documentService,
    );
  }
}
