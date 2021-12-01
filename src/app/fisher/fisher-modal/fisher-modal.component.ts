import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ReCaptchaV3Service } from 'ngx-captcha';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { FisherInterface } from '../shared/interface/fisher.interface';
import { FisherModel } from '../shared/model/fisher.model';
import { AddressInputInterface } from '../../shared/interface/address-input.interface';
import { FisherOptionsInterface } from '../shared/interface/fisher-options.interface';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { FisherLocationInterface } from '../shared/interface/fisher-location.interface';
import { RuntimeFeatureFisherInterface } from '../../shared/interface/runtime-feature-fisher.interface';
import { requiredIfParentInArrayValidator } from '../../shared/validator/required-if-parent-in-array.validator';
import { environment } from '../../../environments/environment';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { AddressInterface } from '../../shared/interface/address.interface';
import { addressValidator } from '../../shared/validator/address.validator';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { GeolocMarkerInterface } from '../../shared/interface/geoloc-marker.interface';

@Component({
  selector: 'app-fisher-modal',
  templateUrl: './fisher-modal.component.html',
  styleUrls: ['./fisher-modal.component.scss'],
})
export class FisherModalComponent extends ModalComponentAbstract<FisherInterface> implements OnInit, OnDestroy, OnChanges {

  /**
   * Fisher feature
   */
  @Input() feature: RuntimeFeatureFisherInterface;

  /**
   * Fisher state
   */
  @Input() fisher: FisherInterface;

  /**
   * Form options
   */
  @Input() options: FisherOptionsInterface;

  /**
   * Fisher data
   */
  @Input() data: FisherModel;

  /**
   * Fisher data
   */
  @Input() location: AddressInputInterface;

  /**
   * Runtime settings
   */
  @Input() settings: RuntimeSettingsInterface;

  /**
   * Country restriction
   */
  @Input() countryRestrictions: string[];

  /**
   * Changed input value
   */
  @Output() changeInput: EventEmitter<InputFormInterface> = new EventEmitter<InputFormInterface>();

  /**
   * Event emitter change location
   */
  @Output() changeLocation: EventEmitter<FisherLocationInterface> = new EventEmitter<FisherLocationInterface>();

  /**
   * DOM element: stepper
   */
  @ViewChild(MatStepper, { static: false }) stepper: MatStepper;

  /**
   * DOM element: modal body
   */
  @ViewChild('modalBodyElement', { static: true }) modalBodyElement: ElementRef;

  /**
   * Map settings
   */
  mapSettings: MapSettingsInterface = {
    centerCoordinates: {
      lat: 46.5,
      lng: 6.5,
    },
    zoomPercentage: 80,
  };

  /**
   * Map markers
   */
  markers: GeolocMarkerInterface[] = [];

  /**
   * Image host
   */
  host: string = environment.fisher.assets.host;

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * Sub form groups
   */
  formGroupAddressInfo: AbstractControl;
  formGroupLocationInfo: AbstractControl;
  formGroupPropertyInfo: AbstractControl;
  formGroupContactInfo: AbstractControl;

  /**
   * Footer inputs
   */
  isDisabledValid: boolean = true;
  isVisibleValid: boolean = false;
  isVisibleInvalid: boolean = false;
  labelInvalid: string = 'label_close';
  labelValid: string = 'label_next';

  /**
   * Inputs visibility
   */
  isVisibleFloor: boolean = false;

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private runtimeService: RuntimeService,
    private translateService: TranslateService,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      addressInfo: this.formBuilder.group({
        address: [this.fisher.addressInfo.address, [Validators.required, addressValidator()]],
      }),
      locationInfo: this.formBuilder.group({
        street: [this.fisher.locationInfo.street, Validators.required],
        houseNumber: [this.fisher.locationInfo.houseNumber, Validators.required],
        zipCode: [this.fisher.locationInfo.zipCode, Validators.required],
        city: [this.fisher.locationInfo.city, Validators.required],
        coordinates: [this.fisher.locationInfo.coordinates],
      }),
      propertyInfo: this.formBuilder.group({
        category: [this.fisher.propertyInfo.category, Validators.required],
        subCategory: [this.fisher.propertyInfo.subCategory],
        livingArea: [this.fisher.propertyInfo.livingArea, Validators.required],
        landArea: [this.fisher.propertyInfo.landArea],
        year: [this.fisher.propertyInfo.year, Validators.required],
        floor: [this.fisher.propertyInfo.floor], // Custom validator
        rooms: [this.fisher.propertyInfo.rooms],
        bathrooms: [this.fisher.propertyInfo.bathrooms],
        state: [this.fisher.propertyInfo.state],
      }),
      contactInfo: this.formBuilder.group({
        firstName: [this.fisher.contactInfo.firstName, Validators.required],
        lastName: [this.fisher.contactInfo.lastName, Validators.required],
        email: [this.fisher.contactInfo.email, [Validators.required, Validators.email]],
        mobile: [this.fisher.contactInfo.mobile],
        address1: [this.fisher.contactInfo.address1],
        address2: [this.fisher.contactInfo.address2],
        zip: [this.fisher.contactInfo.zip],
        city: [this.fisher.contactInfo.city],
        country: [this.fisher.contactInfo.country],
        motivation: [this.fisher.contactInfo.motivation],
        recaptcha: [''],
        language: [this.fisher.contactInfo.language],
      }),
    });

    this.formGroupAddressInfo = this.formGroup.get('addressInfo');
    this.formGroupLocationInfo = this.formGroup.get('locationInfo');
    this.formGroupPropertyInfo = this.formGroup.get('propertyInfo');
    this.formGroupContactInfo = this.formGroup.get('contactInfo');

    // Form change subscription
    Object
      .keys(this.fisher)
      .forEach((groupName: string) => {

        Object
          .keys(this.fisher[groupName])
          .forEach((fieldName: string) => {

            if (this.formGroup.get(groupName)) {

              this.subscriptions.push(
                this.formGroup.get(groupName).get(fieldName).valueChanges.subscribe(
                  value => this.onNextFieldValue(groupName, fieldName, value),
                ),
              );
            }
          });
      });
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Form not defined
    if (!this.formGroup) {

      return;
    }

    // Feature changed
    if (changes.feature) {

      // Custom validators
      this.formGroup.get('propertyInfo.floor').setValidators(
        requiredIfParentInArrayValidator(
          this.formGroup.get('propertyInfo.category'),
          this.feature.categoryIdFloorRequired,
        ),
      );
    }

    // State changed
    if (changes.fisher) {

      const options = { emitEvent: false };

      // Patch values (ignore unknown attributes)
      this.formGroup.patchValue(this.fisher, options);

      if (this.stepper) {

        // Goto step
        this.stepper.selectedIndex = this.fisher.step ? (this.fisher.step - 1) : 0;
      }

      switch (this.fisher.step) {

        case 1:
          this.isDisabledValid = false;
          this.isVisibleValid = false;
          this.isVisibleInvalid = false;
          this.labelInvalid = 'label_close';
          this.labelValid = 'label_fisher_start_valuation';
          break;

        case 2:
          this.isDisabledValid = this.formGroupAddressInfo.invalid;
          this.isVisibleValid = true;
          this.isVisibleInvalid = true;
          this.labelInvalid = 'label_prev_step';
          this.labelValid = 'label_next_step';
          break;

        case 3:
          this.isDisabledValid = this.formGroupLocationInfo.invalid;
          this.isVisibleValid = true;
          this.isVisibleInvalid = true;
          this.labelInvalid = 'label_prev_step';
          this.labelValid = 'label_next_step';

          // Map coordinates
          this.mapSettings = {
            ...this.mapSettings,
            centerCoordinates: this.fisher.locationInfo.coordinates,
          };

          // Map markers
          this.markers = [{
            coordinates: this.fisher.locationInfo.coordinates,
            icon: '',
            title: '',
          }];

          break;

        case 4:
          this.isDisabledValid = this.formGroupPropertyInfo.invalid;
          this.isVisibleValid = true;
          this.isVisibleInvalid = true;
          this.labelInvalid = 'label_prev_step';
          this.labelValid = 'label_next_step';
          break;

        case 5:
          this.isDisabledValid = this.formGroupContactInfo.invalid;
          this.isVisibleValid = true;
          this.isVisibleInvalid = true;
          this.labelInvalid = 'label_prev_step';
          this.labelValid = 'label_fisher_get_valuation';
          break;

        case 6:
          this.isDisabledValid = false;
          this.isVisibleValid = true;
          this.isVisibleInvalid = true;
          this.labelInvalid = 'label_close';
          this.labelValid = 'label_fisher_valuation_start_over';
          break;
      }

      // Inputs visibility
      this.isVisibleFloor = this.feature.categoryIdFloorRequired.indexOf(this.fisher.propertyInfo.category) > -1;
    }

    // Options changed and at initial step
    if (changes.options && this.fisher.step === 1) {

      // Set default values
      this.setDefault();
    }
  }

  /**
   * Clicked the close button
   */
  onClickCloseButton(): void {

    // Goto step 1
    this.stepper.selectedIndex = 0;

    // Emit event
    this.submitModal.emit({
      isValid: false,
      data: {
        step: 0,
        addressInfo: this.formGroupAddressInfo.value,
        locationInfo: this.formGroupLocationInfo.value,
        propertyInfo: this.formGroupPropertyInfo.value,
        contactInfo: this.formGroupContactInfo.value,
      },
    });
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    let newStep = this.fisher.step <= 7 ? (this.fisher.step + 1) : 0;

    if (isValid === false) {

      // Previous button clicked
      if (this.fisher.step > 1 && this.fisher.step < 6) {

        // Goto previous step
        this.stepper.selectedIndex = this.fisher.step - 2;
        newStep = this.fisher.step - 1;
        isValid = true;
      } else {

        // Goto step 1
        this.stepper.selectedIndex = 0;
      }
    } else if (this.fisher.step === 7) {

      this.formGroup.markAsPristine();
      this.formGroup.markAsUntouched();
    }

    // Scroll modal to top
    setTimeout(() => this.modalBodyElement.nativeElement.scrollTop = 0);

    // Loading step 3
    if (newStep === 3) {

      const address: AddressInterface|null = this.formGroupAddressInfo.get('address').value;

      // Address is an object
      if (typeof address === 'object') {

        // Prefill location inputs
        this.formGroupLocationInfo.get('street').setValue(address.street);
        this.formGroupLocationInfo.get('houseNumber').setValue(address.houseNumber);
        this.formGroupLocationInfo.get('zipCode').setValue(address.zipCode);
        this.formGroupLocationInfo.get('city').setValue(address.city);
        this.formGroupLocationInfo.get('coordinates').setValue(address.coordinates);
      }
    }

    // Loading step 6
    if (newStep === 6) {

      try {

        // Captcha
        this.reCaptchaV3Service.execute(environment.recaptcha.siteKey, 'homepage', (token) => {

          // reCaptcha
          this.formGroupContactInfo.get('recaptcha').setValue(token, { emitEvent: false });

          // Submit step
          this.submit(isValid, newStep);

        }, {
          useGlobalDomain: false,
        });
      } catch (e) {

        // Show error notification
        this.runtimeService.notification(NotificationTypeEnum.failure, this.translateService.instant('feedback_activate_fisher'));
      }

      return;
    }

    // Submit step
    this.submit(isValid, newStep);
  }

  /**
   * Stepper's step changed
   */
  onSelectionChangeStep(event: StepperSelectionEvent): void {

    const newStep = (event.selectedIndex + 1);

    // Step not yet updated
    if (newStep !== this.fisher.step) {

      // Emit event
      this.submitModal.emit({
        isValid: true,
        data: {
          step: newStep,
          addressInfo: this.formGroupAddressInfo.value,
          locationInfo: this.formGroupLocationInfo.value,
          propertyInfo: this.formGroupPropertyInfo.value,
          contactInfo: this.formGroupContactInfo.value,
        },
      });
    }
  }

  /**
   * Set default values
   */
  private setDefault(): void {

    const options = { emitEvent: false };

    // Property state
    this.formGroupPropertyInfo.get('state').setValue('well_maintained', options);

    // Contact country
    this.formGroupContactInfo.get('country').setValue('CH', options);

    // Contact motivation
    this.formGroupContactInfo.get('motivation').setValue(
      this.options.motivation.length > 0 ? this.options.motivation[this.options.motivation.length - 1].value : '',
      options,
    );

    // Contact language
    this.formGroupContactInfo.get('language').setValue(
      this.settings.language.current,
      options,
    );
  }

  /**
   * Set input value
   */
  private setValue(group: string, key: string, value: string|string[]): void {

    this.changeInput.emit({
      name: key,
      value: value,
      group,
    });
  }

  /**
   * Submit form step
   */
  private submit(isValid: boolean, step: number): void {

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: {
        step: step,
        addressInfo: this.formGroupAddressInfo.value,
        locationInfo: this.formGroupLocationInfo.value,
        propertyInfo: this.formGroupPropertyInfo.value,
        contactInfo: this.formGroupContactInfo.value,
      },
    });
  }

  /**
   * Next field value
   */
  private onNextFieldValue(group: string, key: string, value: string|string[]): void {

    if (this.formGroup.pristine) {

      return;
    }

    // Changed category
    if (group === 'propertyInfo' && key === 'category' && this.isVisibleFloor === true) {

      // Update floor (set to empty)
      this.setValue('propertyInfo', 'floor', '');
    }

    this.setValue(group, key, value);
  }
}
