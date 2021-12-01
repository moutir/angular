import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { EmailingModel } from '../../shared/model/emailing.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { EmailingPageService } from '../../core/shared/emailing/emailing-page.service';
import { EmailingOptionsInterface } from '../../shared/interface/emailing-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { EmailingModelGeneralAdapterStrategy } from '../../core/shared/emailing/emailing-model-general-adapter.strategy';
import { EmailingModelContentAdapterStrategy } from '../../core/shared/emailing/emailing-model-content-adapter.strategy';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { EmailingContentModel } from '../../shared/model/emailing-content.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAgencyPreferenceInterface } from '../../shared/interface/runtime-agency-preference.interface';
import { EmailingService } from '../../core/shared/emailing/emailing.service';
import { RecipientSummaryInterface } from '../../shared/interface/recipient-summary.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { EmailingPreviewInterface } from '../../shared/interface/emailing-preview.interface';

@Component({
  selector: 'app-emailing-page-write',
  templateUrl: './emailing-page-write.component.html',
  styleUrls: ['./emailing-page-write.component.scss'],
})
export class EmailingPageWriteComponent extends PageWriteComponentAbstract<
  EmailingModel,
  EmailingOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.emailingWriteGeneral;
  readonly PAGE_TAB_PREVIEW: PageTabEnum = PageTabEnum.emailingWritePreview;

  /**
   * State observables
   */
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimeFeatureBrochure$: Observable<RuntimeFeatureBrochureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAgencyPreference$: Observable<RuntimeAgencyPreferenceInterface>;
  summaries$: Observable<RecipientSummaryInterface[]>;
  preview$: Observable<EmailingPreviewInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: EmailingPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private generalModelAdapterStrategy: EmailingModelGeneralAdapterStrategy,
    private contentModelAdapterStrategy: EmailingModelContentAdapterStrategy,
    private emailingService: EmailingService,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    super.ngOnInit();

    // Load configuration using query params
    this.pageService.configuration(this.activatedRoute.snapshot.queryParams);
  }

  /**
   * Submitted summary modal
   */
  onSubmitModalSummary(): void {

    this.emailingService.closeSummary();
  }

  /**
   * Submitted preview modal
   */
  onSubmitModalPreview(): void {

    this.emailingService.closePreview();
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new EmailingModel();

    // Set up general tab fields
    Object
      .keys(this.generalModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.emailingWriteGeneral)
    ;

    // Set up language content fields in general tab
    this.subscriptions.push(
      this
        .runtimeService
        .selectAvailableLanguageIds()
        .pipe(take(2))
        .subscribe(availableLanguageIds => {

          availableLanguageIds.forEach(languageId => {

            this.contentModelAdapterStrategy.setLanguage(languageId);

            model.content[languageId] = new EmailingContentModel();

            Object
              .keys(this.contentModelAdapterStrategy.getFormControlConfig(model))
              .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.emailingWriteGeneral);
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

    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimeFeatureBrochure$ = this.runtimeService.selectFeatureBrochure();
    this.runtimeAgencyPreference$ = this.runtimeService.selectAgencyPreference();
    this.summaries$ = this.emailingService.selectSummaries();
    this.preview$ = this.emailingService.selectPreview();

    // Page is loading if "is loading" or "no available languages yet"
    this.isLoading$ = this.isLoading$.pipe(
      switchMap(isLoading => combineLatest([
        of(isLoading),
        this.availableLanguageIds$,
        this.runtimeFeatureBrochure$,
      ])),
      map(([isLoading, availableLanguageIds, featureBrochure]) => {

        return isLoading ||
          availableLanguageIds.length === 0 ||
          featureBrochure.defaultBrochureTypeId === '';
      }),
    );
  }
}
