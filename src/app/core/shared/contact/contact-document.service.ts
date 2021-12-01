import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ContactConfig } from './contact.config';
import { ContactModel } from '../../../shared/model/contact.model';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class ContactDocumentService extends DocumentServiceAbstract<ContactModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ContactConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getEntity(): EntityEnum {

    return EntityEnum.contact;
  }

  /**
   * @inheritDoc
   */
  getDataAttributes(model: ContactModel): string[] {

    return ['tag'];
  }

  /**
   * @inheritDoc
   */
  getDocumentType(model: ContactModel): DocumentTypeEnum {

    return DocumentTypeEnum.contactDocument;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: ContactModel): DocumentModel[] {

    return model.documents;
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: ContactModel, documents: DocumentModel[]): void {

    model.documents = documents;
  }
}
