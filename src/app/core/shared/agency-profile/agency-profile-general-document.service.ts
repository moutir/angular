import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { AgencyProfileConfig } from './agency-profile.config';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { AgencyModel } from '../../../shared/model/agency.model';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class AgencyProfileGeneralDocumentService extends DocumentServiceAbstract<AgencyModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: AgencyProfileConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
    protected modelAdapterStrategy: FormModelAdapterStrategy<AgencyModel>,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getEntity(): EntityEnum {

    return EntityEnum.agency;
  }

  /**
   * @inheritDoc
   */
  getUid(name: string): string {

    return ['document', this.getEntity(), name, 'general'].join(':');
  }

  /**
   * @inheritDoc
   */
  getDataAttributes(model: AgencyModel): string[] {

    return ['tag'];
  }

  /**
   * @inheritdoc
   */
  getDocumentType(): DocumentTypeEnum {

    return DocumentTypeEnum.agencyDocument;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: AgencyModel): DocumentModel[] {

    return model.documents;
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: AgencyModel, documents: DocumentModel[]): void {

    model.documents = documents;
  }
}
