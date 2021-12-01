import { Component } from '@angular/core';

import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { UserModel } from '../../shared/model/user.model';
import { UserDocumentService } from '../../core/shared/user/user-document.service';

@Component({
  selector: 'app-user-document-list',
  templateUrl: './user-document-list.component.html',
})
export class UserDocumentListComponent extends DocumentListComponentAbstract<UserModel> {

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
    protected documentService: UserDocumentService,
  ) {

    super(
      documentService,
    );
  }

  /**
   * @inheritDoc
   */
  protected getEntityId(): string {

    return this.model.account.contact.id;
  }
}
