import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { WebsiteConfig } from './website.config';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { WebsiteModel } from '../../../shared/model/website.model';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class WebsiteDocumentService extends DocumentServiceAbstract<WebsiteModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
    protected modelAdapterStrategy: FormModelAdapterStrategy<WebsiteModel>,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getEntity(): EntityEnum {

    return EntityEnum.cms;
  }

  /**
   * @inheritDoc
   */
  getDataAttributes(model: WebsiteModel): string[] {

    return ['tag'];
  }

  /**
   * @inheritdoc
   */
  getDocumentType(): DocumentTypeEnum {

    return DocumentTypeEnum.websiteImage;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: WebsiteModel): DocumentModel[] {

    return model.documents;
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: WebsiteModel, documents: DocumentModel[]): void {

    model.documents = documents;
  }
}
