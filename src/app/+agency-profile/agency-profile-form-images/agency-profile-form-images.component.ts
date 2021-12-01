import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AgencyProfileModelImagesAdapterStrategy } from '../../core/shared/agency-profile/agency-profile-model-images-adapter.strategy';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AgencyModel } from '../../shared/model/agency.model';
import { AgencyOptionsInterface } from '../../shared/interface/agency-options.interface';
import { DocumentModel } from '../../shared/model/document.model';
import { UploadStrategyInterface } from '../../shared/interface/upload-strategy.interface';
import { MimeTypeEnum } from '../../shared/enum/mime-type.enum';
import { UploadLayoutTypeEnum } from '../../shared/enum/upload-layout-type.enum';
import { DocumentTypeEnum } from '../../shared/enum/document-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AgencyProfileService } from '../../core/shared/agency-profile/agency-profile.service';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';

@Component({
  selector: 'app-agency-profile-form-images',
  templateUrl: './agency-profile-form-images.component.html',
  styleUrls: ['./agency-profile-form-images.component.scss'],
})
export class AgencyProfileFormImagesComponent extends FormComponentAbstract<
  AgencyModel,
  AgencyOptionsInterface
> implements OnChanges {

  /**
   * Document manager strategy
   */
  @Input() documentManagerStrategy: DocumentManagerStrategyInterface = {
    inputs: [],
    options: {},
  };

  /**
   * Image documents
   */
  @Input() documents: DocumentModel[] = [];

  /**
   * Agency image upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [MimeTypeEnum.image],
    maxFileSize: 30,
    maxFileCount: 1,
    layoutType: UploadLayoutTypeEnum.image,
    isAllowedMultiple: false,
    documentType: DocumentTypeEnum.agencyImage,
    entity: EntityEnum.agency,
    entityId: '',
    description: '',
  };

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: AgencyProfileModelImagesAdapterStrategy,
    private agencyProfileService: AgencyProfileService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.model && this.model && (!changes.model.previousValue || changes.model.previousValue &&
      this.model.id !== changes.model.previousValue.id)) {

      this.uploadStrategy = {
        ...this.uploadStrategy,
        entityId: this.model.id,
      };
    }
  }

  /**
   * Return the language specific form control name
   */
  getFormControlName(modelAttribute: string, field: string, language?: string): string {

    return this.modelAdapterStrategy.getFieldUid(modelAttribute, field, language);
  }

  /**
   * Upload completed
   */
  onUploadComplete(document: DocumentModel, type: keyof AgencyModel): void {

    // Add document inputs
    this.documentManagerStrategy.inputs.forEach(ip => document.data[ip.name] = null);

    if (type === 'logo') {

      this.agencyProfileService.setLogo(document, true);
    } else if (type === 'watermark') {

      this.agencyProfileService.setWatermark(document, true);
    } else if (type === 'defaultPropertyPhoto') {

      this.agencyProfileService.setDefaultPropertyImage(document, true);
    } else if (type === 'prestigeBrochureCover') {

      this.agencyProfileService.setPrestigeBrochureCover(document, true);
    } else if (type === 'emailBanner') {

      this.agencyProfileService.setEmailBanner(document, true);
    }
  }

  /**
   * Clicked on button to remove image
   */
  onClickRemove(document: DocumentModel, type: keyof AgencyModel): void {

    if (type === 'logo') {

      this.agencyProfileService.setLogo(document, false);
    } else if (type === 'watermark') {

      this.agencyProfileService.setWatermark(document, false);
    } else if (type === 'defaultPropertyPhoto') {

      this.agencyProfileService.setDefaultPropertyImage(document, false);
    } else if (type === 'prestigeBrochureCover') {

      this.agencyProfileService.setPrestigeBrochureCover(document, false);
    } else if (type === 'emailBanner') {

      this.agencyProfileService.setEmailBanner(document, false);
    }
  }
}
