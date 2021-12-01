import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AgencyModel } from '../../shared/model/agency.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { AgencyProfilePageService } from '../../core/shared/agency-profile/agency-profile-page.service';
import { AgencyOptionsInterface } from '../../shared/interface/agency-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';
import { ContactModel } from '../../shared/model/contact.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { DocumentModel } from '../../shared/model/document.model';
import { AgencyProfileImageDocumentService } from '../../core/shared/agency-profile/agency-profile-image-document.service';
import { ContactSocialModel } from '../../shared/model/contact-social.model';

@Component({
  selector: 'app-agency-profile-page-read',
  templateUrl: './agency-profile-page-read.component.html',
  styleUrls: ['./agency-profile-page-read.component.scss'],
})
export class AgencyProfilePageReadComponent extends PageReadComponentAbstract<
  AgencyModel,
  AgencyOptionsInterface
> {

  /**
   * Constants
   */
  readonly PAGE_TAB_PROFILE: PageTabEnum = PageTabEnum.agencyProfileReadProfile;
  readonly PAGE_TAB_IMAGE: PageTabEnum = PageTabEnum.agencyProfileReadImage;
  readonly PAGE_TAB_DOCUMENT: PageTabEnum = PageTabEnum.agencyProfileReadDocument;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;
  currentLanguageLabel$: Observable<string>;
  isLoadingImages$: Observable<boolean>;

  /**
   * Page options
   */
  options: AgencyOptionsInterface;

  /**
   * Created contact
   */
  createdContact: ContactModel = new ContactModel();

  /**
   * Updated contact
   */
  updatedContact: ContactModel = new ContactModel();

  /**
   * Images
   */
  images: GalleryImageInterface[] = [];
  imagesHash: string = '';

  /**
   * Documents
   */
  documents: DocumentModel[] = [];
  documentsHash: string = '';

  /**
   * Socials
   */
  socials: ContactSocialModel[] = [];

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgencyProfilePageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private imageDocumentService: AgencyProfileImageDocumentService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Return the social network name
   */
  getSocialMediaName(network: string): string {

    if (network === 'website') {

      return 'label_website';
    }

    const option = this.options.socialMedia && this.options.socialMedia.find(o => o.value === network);

    return option && option.text || '';
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.currentLanguageLabel$ = this.runtimeService.selectCurrentLanguageLabel();
    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
    this.isLoadingImages$ = this.imageDocumentService.selectLoading(this.imageDocumentService.register(this.PAGE_TAB_IMAGE));

    // Options
    this.subscriptions.push(
      this.pageService.selectOptions().subscribe(opts => this.options = opts),
    );
  }

  /**
   * Next model
   */
  protected onNextModel(model: AgencyModel): void {

    super.onNextModel(model);

    // Socials
    this.socials = model.socials.filter(social => social.url !== 'null' && !!social.url);

    // Created contact
    this.createdContact.id = this.model.createContactId;
    this.createdContact.fullName = this.model.createContactName;

    // Updated contact
    this.updatedContact.id = this.model.updateContactId;
    this.updatedContact.fullName = this.model.updateContactName;

    const imagesHash = JSON.stringify(model.images);

    // Images
    if (imagesHash !== this.imagesHash) {

      this.images = [];

      model.images.forEach(image => {

        // Not special images
        if (!image.isAgencyLogo && !image.isAgencyWatermark &&
          !image.isDefaultPropertyImage && !image.isPrestigeBrochureCover && !image.isEmailBanner) {

          this.images.push({
            title: image.tag || image.name,
            url: image.photoLargeURL,
            thumbnailUrl: image.photoSmallURL,
          });
        }
      });
    }

    // Documents
    const documentsHash = JSON.stringify(model.documents);

    if (documentsHash !== this.documentsHash) {

      this.documents = model.documents;
      this.documentsHash = documentsHash;
    }
  }
}
