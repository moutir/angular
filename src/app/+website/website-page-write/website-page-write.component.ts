import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { WebsiteModel } from '../../shared/model/website.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { WebsitePageService } from '../../core/shared/website/website-page.service';
import { WebsiteOptionsInterface } from '../../shared/interface/website-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { WebsiteContentModel } from '../../shared/model/website-content.model';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { WebsiteConfig } from '../../core/shared/website/website.config';
import { Dictionary } from '../../shared/class/dictionary';
import { KeyValueType } from '../../shared/type/key-value.type';
import { WebsiteModelGeneralAdapterStrategy } from '../../core/shared/website/website-model-general-adapter.strategy';
import { WebsiteModelContentAdapterStrategy } from '../../core/shared/website/website-model-content-adapter.strategy';
import { DocumentModel } from '../../shared/model/document.model';
import { WebsiteModelStyleAdapterStrategy } from '../../core/shared/website/website-model-style-adapter.strategy';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-website-page-write',
  templateUrl: './website-page-write.component.html',
  styleUrls: ['./website-page-write.component.scss'],
})
export class WebsitePageWriteComponent extends PageWriteComponentAbstract<WebsiteModel, WebsiteOptionsInterface> {

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;

  /**
   * Documents
   */
  documents: DocumentModel[] = [];
  documentsHash: string = '';

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.websiteWriteGeneral;
  readonly PAGE_TAB_STYLE: PageTabEnum = PageTabEnum.websiteWriteStyle;
  readonly PAGE_TAB_PHOTO: PageTabEnum = PageTabEnum.websiteWritePhoto;
  readonly PERMISSION_WEBSITE_CONFIG_READ: PermissionEnum = PermissionEnum.websiteConfigRead;
  readonly PERMISSION_WEBSITE_CONTENT_READ: PermissionEnum = PermissionEnum.websiteContentRead;

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsitePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    protected moduleConfig: WebsiteConfig,
    private runtimeService: RuntimeService,
    private generalModelAdapterStrategy: WebsiteModelGeneralAdapterStrategy,
    private styleModelAdapterStrategy: WebsiteModelStyleAdapterStrategy,
    private contentModelAdapterStrategy: WebsiteModelContentAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * Return the tab UID for a write-content tab in the given language
   */
  getWriteContentTabUid(language: LanguageEnum): PageTabEnum {

    return this.pageService.getWriteContentTabUid(language);
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new WebsiteModel();

    // General tab fields
    Object
      .keys(this.generalModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.websiteWriteGeneral);

    // Style tab fields
    Object
      .keys(this.styleModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.websiteWriteStyle);

    // Set up language tab fields
    this.subscriptions.push(
      this
        .runtimeService
        .selectAvailableLanguageIds()
        .pipe(take(2))
        .subscribe(availableLanguageIds => {

          availableLanguageIds.forEach(languageId => {

            this.contentModelAdapterStrategy.setLanguage(languageId);

            model.homePageContent[languageId] = new WebsiteContentModel();

            Object
              .keys(this.contentModelAdapterStrategy.getFormControlConfig(model))
              .forEach((controlName) => fieldTabMapping[controlName] = this.getWriteContentTabUid(languageId));
          });
        }),
    );

    return fieldTabMapping;
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();

    this.model$ = this.pageService
      .selectModel()
      .pipe(map(model => {

        const documentsHash = JSON.stringify(model.documents);

        if (documentsHash !== this.documentsHash) {

          this.documents = model.documents;
          this.documentsHash = documentsHash;
        }

        return model;
      }));
  }
}
