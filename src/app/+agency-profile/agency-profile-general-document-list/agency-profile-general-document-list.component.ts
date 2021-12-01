import { Component } from '@angular/core';

import { AgencyProfileGeneralDocumentService } from '../../core/shared/agency-profile/agency-profile-general-document.service';
import { DocumentListComponentAbstract } from '../../shared/component/document-list/document-list-component.abstract';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { AgencyModel } from '../../shared/model/agency.model';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-agency-profile-general-document-list',
  templateUrl: './agency-profile-general-document-list.component.html',
})
export class AgencyProfileGeneralDocumentListComponent extends DocumentListComponentAbstract<AgencyModel> {

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [],
    maxFileSize: 30,
    maxFileCount: 100,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.agencyDocument,
    entity: EntityEnum.agency,
    entityId: '',
    description: 'label_agency_document_uploader_description',
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
        icon: 'tag',
      },
    ],
    options: {},
  };

  /**
   * Constructor
   */
  constructor(
    protected documentService: AgencyProfileGeneralDocumentService,
  ) {

    super(
      documentService,
    );
  }

}
