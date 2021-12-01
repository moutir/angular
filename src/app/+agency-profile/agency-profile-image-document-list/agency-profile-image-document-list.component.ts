import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';

import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { AgencyModel } from '../../shared/model/agency.model';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AgencyProfileImageDocumentService } from '../../core/shared/agency-profile/agency-profile-image-document.service';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';
import { DocumentModel } from '../../shared/model/document.model';

@Component({
  selector: 'app-agency-profile-image-document-list',
  templateUrl: './agency-profile-image-document-list.component.html',
})
export class AgencyProfileImageDocumentListComponent extends
  DocumentListComponentAbstract<AgencyModel> implements OnChanges {

  /**
   * Changed images form input and model
   */
  @Output() changeForm: EventEmitter<ChangeFormEventInterface<AgencyModel>> = new EventEmitter<ChangeFormEventInterface<AgencyModel>>();

  /**
   * Validation error on images form
   */
  @Output() pristineForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [],
    maxFileSize: 30,
    maxFileCount: 50,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.agencyImage,
    entity: EntityEnum.agency,
    entityId: '',
    description: 'label_agency_image_uploader_description',
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
      {
        name: 'email_banner_url',
        type: 'text',
        label: 'label_email_banner_url',
        default: '',
      },
    ],
    options: {},
  };

  private specialDocuments: DocumentModel[] = [];

  /**
   * Constructor
   */
  constructor(
    protected documentService: AgencyProfileImageDocumentService,
  ) {

    super(
      documentService,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.documents) {

      this.specialDocuments = [];

      this.documents = this.documents.filter(doc => {

        // Special image documents
        if (doc.isAgencyLogo || doc.isAgencyWatermark || doc.isDefaultPropertyImage ||
          doc.isPrestigeBrochureCover || doc.isEmailBanner) {

          this.specialDocuments.push(doc);
          return;
        }

        return doc;
      });
    }
  }

  /**
   * @inheritDoc
   */
  onChangeDocuments(documents: DocumentModel[]): void {

    const docs = [ ...documents, ...this.specialDocuments ];

    this.documentService.changeList(this.uid, this.model, docs);
  }

  /**
   * Changed images form
   */
  onChangeImagesForm(event: ChangeFormEventInterface<AgencyModel>): void {

    if (event.input.name in this.model) {

      return this.changeForm.emit(event);
    }

    const segments = event.input.name.split(/_(.+)/);
    const document = this.model[segments[0]] ? this.model[segments[0]].clone<DocumentModel>() : new DocumentModel();

    document.data = { ...document.data, [segments[1]]: event.input.value };
    event.input.name = segments[1];

    this.documentService.changeOne(this.uid, this.model, document, event.input);
  }

  /**
   * Pristine status changed for images form
   */
  onPristineImagesForm(event: boolean): void {

    this.pristineForm.emit(event);
  }
}
