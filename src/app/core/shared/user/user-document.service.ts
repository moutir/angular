import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ContactDocumentService } from '../contact/contact-document.service';
import { UserModel } from '../../../shared/model/user.model';
import { UserConfig } from './user.config';

@Injectable()
export class UserDocumentService extends DocumentServiceAbstract<UserModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: UserConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
    private contactDocumentService: ContactDocumentService,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getEntity(): EntityEnum {

    return EntityEnum.user;
  }

  /**
   * @inheritDoc
   */
  getDataAttributes(model: UserModel): string[] {

    return this.contactDocumentService.getDataAttributes(model.account.contact);
  }

  /**
   * @inheritDoc
   */
  getDocumentType(model: UserModel): DocumentTypeEnum {

    return this.contactDocumentService.getDocumentType(model.account.contact);
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: UserModel): DocumentModel[] {

    return this.contactDocumentService.getDocuments(model.account.contact);
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: UserModel, documents: DocumentModel[]): void {

    this.contactDocumentService.setDocuments(model.account.contact, documents);
  }
}
