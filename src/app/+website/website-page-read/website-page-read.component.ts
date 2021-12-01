import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { WebsitePageService } from '../../core/shared/website/website-page.service';
import { WebsiteModel } from '../../shared/model/website.model';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WebsiteOptionsInterface } from '../../shared/interface/website-options.interface';
import { WebsiteDocumentService } from '../../core/shared/website/website-document.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { WebsiteLayoutEnum } from '../../shared/enum/website-layout.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-website-page-read',
  templateUrl: './website-page-read.component.html',
  styleUrls: ['./website-page-read.component.scss'],
})
export class WebsitePageReadComponent extends PageReadComponentAbstract<
  WebsiteModel,
  WebsiteOptionsInterface
> {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.websiteReadGeneral;
  readonly PAGE_TAB_STYLE: PageTabEnum = PageTabEnum.websiteReadStyle;
  readonly PAGE_TAB_PHOTO: PageTabEnum = PageTabEnum.websiteReadPhoto;
  readonly PERMISSION_WEBSITE_CONFIG_READ: PermissionEnum = PermissionEnum.websiteConfigRead;
  readonly PERMISSION_WEBSITE_CONTENT_READ: PermissionEnum = PermissionEnum.websiteContentRead;
  readonly WEBSITE_LAYOUT_WORDPRESS: WebsiteLayoutEnum = WebsiteLayoutEnum.wordpress;

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;
  isLoadingPhotos$: Observable<boolean>;

  /**
   * Images
   */
  images: GalleryImageInterface[] = [];

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsitePageService,
    protected activatedRoute: ActivatedRoute,
    protected runtimeService: RuntimeService,
    private documentService: WebsiteDocumentService,
    private clipboardService: ClipboardService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Clicked on copy button
   */
  onClickButtonCopy(value: string): void {

    // Copy value to clipboard
    this.clipboardService.copy(value);

    // Notification
    this.runtimeService.notification(NotificationTypeEnum.success, 'copied_to_clipboard');
  }

  /**
   * @inheritdoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
    this.isLoadingPhotos$ = this.documentService.selectLoading(this.documentService.register(this.PAGE_TAB_PHOTO));
  }

  /**
   * Next model
   */
  protected onNextModel(model: WebsiteModel): void {

    super.onNextModel(model);

    // Images
    this.images = model.documents.map(document => {

      return {
        title: document.tag || document.name,
        url: document.photoLargeURL,
        thumbnailUrl: document.photoSmallURL,
      };
    });
  }
}
