import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocumentServiceAbstract } from '../../../shared/service/document.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { DocumentApiService } from '../../../api/shared/document/document-api.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { EmailingConfig } from './emailing.config';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { DocumentListResponseInterface } from '../../../api/shared/document/document-list-response.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class EmailingDocumentService extends DocumentServiceAbstract<EmailingModel> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: EmailingConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
    protected modelAdapterStrategy: FormModelAdapterStrategy<EmailingModel>,
  ) {

    super(moduleConfig, store$, documentApiService);
  }

  /**
   * @inheritDoc
   */
  getDocumentType(model: EmailingModel): DocumentTypeEnum {

    return DocumentTypeEnum.agencyDocument;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: EmailingModel): DocumentModel[] {

    return [];
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: EmailingModel, documents: DocumentModel[]): EmailingModel {

    return model;
  }

  /**
   * Set model documents per entity and return the model
   */
  setModelDocumentsPerEntity(
    model: EmailingModel,
    documents: KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>,
  ): EmailingModel {

    const newModel = model.clone<EmailingModel>();
    const selectedDocs = { ...newModel.documents };

    // Reset
    newModel.documents = {};

    Object.keys(documents).forEach(entity => {

      Object.keys(documents[entity]).forEach(id => {

        const key = [entity, id].join('_');

        newModel.documents = {
          ...newModel.documents,
          [key]: selectedDocs[key] || [],
        };
      });
    });

    return newModel;
  }

  /**
   * List documents per entity
   */
  listPerEntity(
    agencyIds: string[],
    contactIds: string[],
    propertyIds: string[],
    promotionIds: string[],
  ): Observable<KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>> {

    return this.documentApiService
      .listPerEntity(agencyIds, contactIds, propertyIds, promotionIds)
      .pipe(
        map(response => {

          const docsPerEntity = this.listPerEntityResponse(response);

          // Set default value for properties, if not available
          propertyIds.forEach(id => {

            if (!docsPerEntity.property[id]) {

              docsPerEntity.property[id] = [];
            }
          });

          return docsPerEntity;
        }),
      );
  }

  /**
   * Handle a listPerEntity() response and return a dictionary of documents per entity
   */
  private listPerEntityResponse(response: DocumentListResponseInterface): KeyValueType<EntityEnum, Dictionary<DocumentModel[]>> {

    const documents = {
      agency: {},
      contact: {},
      property: {},
      promotion: {},
    };

    if (!response || !response.data || !response.data.allDocuments) {

      return documents;
    }

    response.data.allDocuments.forEach(doc => {

      const document = new DocumentModel();

      document.id = doc.id;
      document.name = doc.filename;

      // Agency
      if (doc.agency_id) {

        documents.agency[doc.agency_id] = documents.agency[doc.agency_id] || [];

        return documents.agency[doc.agency_id].push(document);
      }

      // Contact
      if (doc.contact_id) {

        documents.contact[doc.contact_id] = documents.contact[doc.contact_id] || [];

        return documents.contact[doc.contact_id].push(document);
      }

      // Property
      if (doc.property_id) {

        documents.property[doc.property_id] = documents.property[doc.property_id] || [];

        return documents.property[doc.property_id].push(document);
      }

      // Promotion
      if (doc.promotion_id) {

        // Include promotion name also in the document name
        document.name = [document.name, (doc.promotion_name || '')].join('|');

        documents.promotion[doc.promotion_id] = documents.promotion[doc.promotion_id] || [];

        return documents.promotion[doc.promotion_id].push(document);
      }
    });

    return documents;
  }
}
