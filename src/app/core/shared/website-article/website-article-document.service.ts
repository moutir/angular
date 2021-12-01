import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { WebsiteArticleConfig } from './website-article.config';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class WebsiteArticleDocumentService extends DocumentServiceAbstract<WebsiteArticleModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteArticleConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
    protected modelAdapterStrategy: FormModelAdapterStrategy<WebsiteArticleModel>,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getEntity(): EntityEnum {

    return EntityEnum.cmsArticle;
  }

  /**
   * @inheritDoc
   */
  getDataAttributes(model: WebsiteArticleModel): string[] {

    return ['tag'];
  }

  /**
   * @inheritdoc
   */
  getDocumentType(): DocumentTypeEnum {

    return DocumentTypeEnum.websiteArticleImage;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: WebsiteArticleModel): DocumentModel[] {

    return model.documents;
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: WebsiteArticleModel, documents: DocumentModel[]): void {

    model.documents = documents;
  }
}
