import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocumentLoadResponseInterface } from './document-load-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { HelperService } from '../../../core/shared/helper.service';
import { DocumentRemoveResponseInterface } from './document-remove-response.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { DocumentSaveRequestInterface } from './document-save-request.interface';
import { DocumentListResponseInterface } from './document-list-response.interface';
import { DocumentListRequestInterface } from './document-list-request.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class DocumentApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List documents
   */
  list(entity: EntityEnum, entityId: string, documentType: DocumentTypeEnum, dataAttributes: string[]): Observable<DocumentModel[]> {

    return this.httpService
      .get<null, DocumentLoadResponseInterface>(
        ApiEndpointEnum.documentLoad,
        null,
        {
          entity: entity,
          entityId: entityId,
          documentType: documentType,
        },
      ).pipe(
        map(response => response.map(doc => {

          const document = new DocumentModel();

          document.id = doc.id;
          document.name = doc.name;
          document.size = doc.size;
          document.extension = doc.type;
          document.tag = doc.tag;
          document.fileUrl = doc.fileUrl;
          document.photoSmallURL = (doc.mimeType || '').indexOf('image') > -1 ? doc.thumbnailUrl : '';
          document.photoLargeURL = (doc.mimeType || '').indexOf('image') > -1 ? (doc.fileUrl || doc.photoLargeUrl) : '';
          document.updateDate = this.helperService.stringToDate(doc.upload_date);
          document.isUserAvatar = doc.use_as_avatar === '1';
          document.isDefaultPropertyImage = doc.use_as_default_property_picture === '1';
          document.isEmailBanner = doc.use_as_email_banner === '1';
          document.isPrestigeBrochureCover = doc.use_as_prestige_brochure_cover === '1';
          document.isSignature = doc.use_as_signature === '1';
          document.isAgencyWatermark = doc.use_as_watermark === '1';
          document.isAgencyLogo = doc.use_as_logo === '1';

          // Specific attributes set on the document itself
          dataAttributes.forEach(attr => {

            if (doc.hasOwnProperty(attr)) {

              document.data[attr] = doc[attr] || '';
            }
          });

          return document;
        })),
      )
    ;
  }

  /**
   * List documents per entity
   */
  listPerEntity(
    agencyIds: string[],
    contactIds: string[],
    propertyIds: string[],
    promotionIds: string[],
  ): Observable<DocumentListResponseInterface> {

    return this.httpService
      .get<DocumentListRequestInterface, DocumentListResponseInterface>(
        ApiEndpointEnum.documentList,
        {
          agencies: agencyIds,
          contacts: contactIds,
          properties: propertyIds,
          developments: promotionIds,
        },
        null,
        false,
      );
  }

  /**
   * Remove document
   */
  remove(
    entity: EntityEnum,
    entityId: string,
    documentType: DocumentTypeEnum,
    documentId: string,
  ): Observable<DocumentRemoveResponseInterface> {

    return this
      .httpService
      .get<null, DocumentRemoveResponseInterface>(
        ApiEndpointEnum.documentDelete,
        null,
        {
          entity: entity,
          entityId: entityId,
          documentType: documentType,
          documentId: documentId,
        },
      )
    ;
  }

  /**
   * Save document attribute
   */
  save(
    entity: EntityEnum,
    documentType: DocumentTypeEnum,
    document: DocumentModel,
    dataAttribute: string,
  ): Observable<LegacySaveResponseInterface> {

    let url: ApiEndpointEnum = ApiEndpointEnum.documentSaveTag;
    const value = String(document.data[dataAttribute]);

    if (dataAttribute === 'email_banner_url') {

      url = ApiEndpointEnum.documentSaveUrl;
      dataAttribute = 'url';
    } else if (dataAttribute.indexOf('title') > -1) {

      url = ApiEndpointEnum.documentSaveTitle;
    }

    return this
      .httpService
      .get<DocumentSaveRequestInterface, LegacySaveResponseInterface>(
        url,
        { [dataAttribute]: value },
        {
          entity: entity,
          documentType: documentType,
          documentId: document.id,
        },
      )
    ;
  }
}
