import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AgencyModel } from '../../shared/model/agency.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { AgencyProfilePageService } from '../../core/shared/agency-profile/agency-profile-page.service';
import { AgencyOptionsInterface } from '../../shared/interface/agency-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { AgencyProfileModelProfileAdapterStrategy } from '../../core/shared/agency-profile/agency-profile-model-profile-adapter.strategy';
import { DocumentModel } from '../../shared/model/document.model';
import { AgencyEmailPreviewInterface } from '../../shared/interface/agency-email-preview.interface';
import { AgencyProfileService } from '../../core/shared/agency-profile/agency-profile.service';

@Component({
  selector: 'app-agency-profile-page-write',
  templateUrl: './agency-profile-page-write.component.html',
})
export class AgencyProfilePageWriteComponent extends PageWriteComponentAbstract<
  AgencyModel,
  AgencyOptionsInterface
> {

  /**
   * Constants
   */
  readonly PAGE_TAB_PROFILE: PageTabEnum = PageTabEnum.agencyProfileWriteProfile;
  readonly PAGE_TAB_IMAGE: PageTabEnum = PageTabEnum.agencyProfileWriteImage;
  readonly PAGE_TAB_DOCUMENT: PageTabEnum = PageTabEnum.agencyProfileWriteDocument;

  /**
   * State observables
   */
  emailPreview$: Observable<AgencyEmailPreviewInterface>;

  /**
   * Documents
   */
  generalDocuments: DocumentModel[] = [];
  imageDocuments: DocumentModel[] = [];
  generalDocumentsHash: string = '';
  imageDocumentsHash: string = '';

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgencyProfilePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private profileModelAdapterStrategy: AgencyProfileModelProfileAdapterStrategy,
    private agencyProfileService: AgencyProfileService,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * Submitted email preview modal
   */
  onSubmitModalPreview(): void {

    this.agencyProfileService.closeEmailPreview();
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new AgencyModel();

    // Set up profile tab fields
    Object
      .keys(this.profileModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.agencyProfileWriteProfile)
    ;

    return fieldTabMapping;
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.emailPreview$ = this.agencyProfileService.selectEmailPreview();

    this.model$ = this.pageService
      .selectModel()
      .pipe(map(model => {

        const imageDocumentsHash = JSON.stringify(model.images);
        const generalDocumentsHash = JSON.stringify(model.documents);

        if (imageDocumentsHash !== this.imageDocumentsHash) {

          this.imageDocuments = model.images;
          this.imageDocumentsHash = imageDocumentsHash;
        }

        if (generalDocumentsHash !== this.generalDocumentsHash) {

          this.generalDocuments = model.documents;
          this.generalDocumentsHash = generalDocumentsHash;
        }

        return model;
      }));
  }
}
