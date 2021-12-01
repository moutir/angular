import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FisherConfig } from './fisher.config';
import { NotificationInterface } from '../shared/interface/notification.interface';
import { RuntimeService } from '../runtime/shared/runtime.service';
import { RuntimeDataEnum } from '../shared/enum/runtime-data.enum';
import { BrowserService } from '../core/shared/browser/browser.service';
import { FisherService } from './shared/fisher.service';
import { InputFormInterface } from '../shared/interface/input-form.interface';
import { ModalChoiceInterface } from '../shared/interface/modal-choice.interface';
import { FisherInterface } from './shared/interface/fisher.interface';
import { FisherModel } from './shared/model/fisher.model';
import { FisherOptionsInterface } from './shared/interface/fisher-options.interface';
import { RuntimeFeatureFisherInterface } from '../shared/interface/runtime-feature-fisher.interface';
import { RuntimeSettingsInterface } from '../shared/interface/runtime-settings.interface';
import { NotificationTypeEnum } from '../shared/enum/notification-type.enum';

@Component({
  selector: 'app-fisher',
  templateUrl: './fisher.component.html',
  styleUrls: ['./fisher.component.scss'],
})
export class FisherComponent implements OnInit {

  /**
   * State observables
   */
  notification$: Observable<NotificationInterface|null>;
  settings$: Observable<RuntimeSettingsInterface>;

  /**
   * Is the layout ready to be displayed ?
   */
  isReady: boolean;

  /**
   * State observables
   */
  fisherForm$: Observable<FisherInterface>;
  fisherData$: Observable<FisherModel>;
  fisherOptions$: Observable<FisherOptionsInterface>;
  fisherFeature$: Observable<RuntimeFeatureFisherInterface>;

  /**
   * Country restriction
   */
  countryRestrictions: string[];

  /**
   * Constructor
   */
  constructor(
    private fisherConfig: FisherConfig,
    private translateService: TranslateService,
    private runtimeService: RuntimeService,
    private browserService: BrowserService,
    private priceHubbleFisherService: FisherService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set state observables
    this.notification$ = this.runtimeService.selectNotification();
    this.settings$ = this.runtimeService.selectSettings();
    this.fisherForm$ = this.priceHubbleFisherService.selectForm();
    this.fisherData$ = this.priceHubbleFisherService.selectData();
    this.fisherOptions$ = this.priceHubbleFisherService.selectOptions();
    this.fisherFeature$ = this.runtimeService.selectFeatureFisher();

    // Configure translation service
    this.translateService.addLangs([this.fisherConfig.languageCurrent]);
    this.translateService
      .use(this.fisherConfig.languageCurrent)
      .subscribe(
        () => this.onLoadTranslation(),
        err => this.runtimeService.notification(NotificationTypeEnum.failure, 'Unable to load translations, please reload the page.'),
      );

    // Require runtime data
    this.runtimeService.requireData([
      RuntimeDataEnum.settings,
      RuntimeDataEnum.featureFisher,
      RuntimeDataEnum.optionCountryById,
      RuntimeDataEnum.optionPropertyType,
    ]);

    // Expose to window object
    this.browserService.getWindow().rfFisher = (): void => this.priceHubbleFisherService.openModal();

    // Subscribe to route change which includes query param 'fisher'
    this.activatedRoute.queryParams
      .pipe(filter(params => params.hasOwnProperty('fisher')))
      .subscribe(params => this.priceHubbleFisherService.openModal())
    ;

    // Country restrictions
    this.countryRestrictions = this.fisherConfig.countryRestrictions;

    // Fisher is ready!
    this.browserService.triggerEvent('realforce.fisher.ready');
  }

  /**
   * Changed form input
   */
  onChangeInput(input: InputFormInterface): void {

    // Update form input
    this.priceHubbleFisherService.updateFormInput(input);
  }

  /**
   * Submitted fisher modal
   */
  onSubmitModalFisher(event: ModalChoiceInterface<FisherInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      this.priceHubbleFisherService.closeModal();

      return;
    }

    this.priceHubbleFisherService.updateStep(event.data);
  }

  /**
   * Loaded translation
   */
  private onLoadTranslation(): void {

    // Set the app as ready
    this.isReady = true;
  }
}
