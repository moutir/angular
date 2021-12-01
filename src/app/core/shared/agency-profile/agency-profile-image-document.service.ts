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
export class AgencyProfileImageDocumentService extends DocumentServiceAbstract<AgencyModel> {

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
  getDataAttributes(model: AgencyModel): string[] {

    return ['tag', 'email_banner_url'];
  }

  /**
   * @inheritDoc
   */
  getUid(name: string): string {

    return ['document', this.getEntity(), name, 'image'].join(':');
  }

  /**
   * @inheritdoc
   */
  getDocumentType(): DocumentTypeEnum {

    return DocumentTypeEnum.agencyImage;
  }

  /**
   * @inheritDoc
   */
  getDocuments(model: AgencyModel): DocumentModel[] {

    return model.images;
  }

  /**
   * @inheritDoc
   */
  setDocuments(model: AgencyModel, documents: DocumentModel[]): void {

    const defaultDocument = new DocumentModel();
    this.getDataAttributes(model).forEach(attr => defaultDocument.data[attr] = null);

    model.images = documents;

    // Set special images
    documents.forEach(doc => {

      if (doc.isAgencyLogo === true) {

        model.logo = doc;
      }

      if (doc.isAgencyWatermark === true) {

        model.watermark = doc;
      }

      if (doc.isDefaultPropertyImage === true) {

        model.defaultPropertyPhoto = doc;
      }

      if (doc.isPrestigeBrochureCover === true) {

        model.prestigeBrochureCover = doc;
      }

      if (doc.isEmailBanner === true) {

        model.emailBanner = doc;
      }
    });

    // Logo
    if (!model.logo || !model.logo.id) {

      model.logo = defaultDocument.clone<DocumentModel>();
    }

    // Watermark
    if (!model.watermark || !model.watermark.id) {

      model.watermark = defaultDocument.clone<DocumentModel>();
    }

    // Default property image
    if (!model.defaultPropertyPhoto || !model.defaultPropertyPhoto.id) {

      model.defaultPropertyPhoto = defaultDocument.clone<DocumentModel>();
    }

    // Prestige brochure cover
    if (!model.prestigeBrochureCover || !model.prestigeBrochureCover.id) {

      model.prestigeBrochureCover = defaultDocument.clone<DocumentModel>();
    }

    // Email banner
    if (!model.emailBanner || !model.emailBanner.id) {

      model.emailBanner = defaultDocument.clone<DocumentModel>();
    }
  }
}
