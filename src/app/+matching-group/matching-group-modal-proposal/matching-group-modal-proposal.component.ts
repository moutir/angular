import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { MatchingGroupProposalInterface } from '../../shared/interface/matching-group-proposal.interface';
import { MatchingGroupProposalOptionsInterface } from '../../shared/interface/matching-group-proposal-options.interface';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-matching-group-modal-proposal',
  templateUrl: './matching-group-modal-proposal.component.html',
  styleUrls: ['./matching-group-modal-proposal.component.scss'],
})
export class MatchingGroupModalProposalComponent extends
  ModalComponentAbstract<MatchingGroupProposalInterface> implements OnInit, OnDestroy, OnChanges {

  /**
   * Constants
   */
  readonly PERMISSION_MAILING_SEND_ON_BEHALF: PermissionEnum = PermissionEnum.mailingSendOnBehalf;

  /**
   * Proposal state
   */
  @Input() proposal: MatchingGroupProposalInterface;

  /**
   * Form options
   */
  @Input() options: MatchingGroupProposalOptionsInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Changed input
   */
  @Output() changeInput: EventEmitter<InputFormInterface> = new EventEmitter<InputFormInterface>();

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];
  private emailContentLanguageIdSubscription: Subscription|null = null;
  private emailContentLanguageHtmlSubscription: Subscription|null = null;

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Define form group
    this.formGroup = this.formBuilder.group({
      emailTemplateId: [this.proposal.emailTemplateId, Validators.required],
      emailContentId: [this.proposal.emailContentId, Validators.required],
      emailBrochureTypeId: [this.proposal.emailBrochureTypeId, Validators.required],
      emailBrochurePrivacyId: [this.proposal.emailBrochurePrivacyId, Validators.required],
      senderId: [this.proposal.senderId],
    });

    // Form controls change subscriptions
    Object
      .keys(this.formGroup.controls)
      .forEach((name: keyof MatchingGroupProposalInterface) => {

        this.subscriptions.push(
          this.formGroup.get(name).valueChanges.subscribe(value => this.changeInput.emit({ name, value })),
        );
      });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // No form defined yet
    if (!this.formGroup) {

      return;
    }

    // Is opening the modal
    const isOpening = changes.isVisible !== undefined &&
      changes.isVisible.previousValue === false &&
      changes.isVisible.currentValue === true;

    // Form state changed
    if (changes.proposal && JSON.stringify(changes.proposal.previousValue) !== JSON.stringify(changes.proposal.currentValue)) {

      const proposal = { ...this.proposal };

      // Patch values
      this.formGroup.patchValue(proposal, { emitEvent: isOpening });
    }

    // Languages and contacts set
    if (
      changes.options &&
      this.options.emailContentLanguages !== null &&
      this.options.emailContentLanguages.length > 0 &&
      this.options.emailContentContacts !== null &&
      JSON.stringify(changes.options.previousValue) !== JSON.stringify(changes.options.currentValue)
    ) {

      // Define default language (English if available)
      const languages = this.options.emailContentLanguages.map(option => option.value);
      const defaultLanguage = languages
        .some(language => language === LanguageEnum.en) ? LanguageEnum.en : '';

      const controlConfig = {};
      const controlValue = {};

      // For each contact
      this.options.emailContentContacts.forEach(contact => {

        const language = this.proposal.emailContentLanguageId[contact.id] || defaultLanguage;

        controlValue[contact.id] = languages.indexOf(language) > -1 ? language : languages[0];
        controlConfig[contact.id] = [controlValue[contact.id], Validators.required];
      });

      // Already has control
      if (this.formGroup.contains('emailContentLanguageId')) {

        // Remove control
        this.formGroup.removeControl('emailContentLanguageId');
        this.emailContentLanguageIdSubscription.unsubscribe();
      }

      // Add control
      const control = this.formBuilder.group(controlConfig);
      this.formGroup.addControl('emailContentLanguageId', control);
      this.emailContentLanguageIdSubscription = control.valueChanges
        .subscribe(value => this.changeInput.emit({ name: 'emailContentLanguageId', value }));

      // Set default value (will emit change event)
      control.setValue(controlValue);
    }

    // Opening OR contact languages available
    if (
      isOpening === true ||
      changes.options &&
      this.options.emailContentContactLanguages !== null &&
      this.options.emailContentContactLanguages.length > 0 &&
      JSON.stringify(changes.options.previousValue) !== JSON.stringify(changes.options.currentValue)
    ) {

      const formControlConfig = {};
      const formControlValue = {};

      if (this.options.emailContentContactLanguages) {

        // For each contact languages
        this.options.emailContentContactLanguages.forEach(option => {

          formControlValue[option.value] = this.proposal.emailContentLanguageHtml[option.value] || '';

          // Set value (Field will be updated on blur event only)
          formControlConfig[option.value] = [formControlValue[option.value], { updateOn: 'blur' }];
        });

        // Add id
        formControlValue['id'] = this.proposal.emailContentLanguageHtml.id;
        formControlConfig['id'] = [formControlValue['id']];

        // Already has control
        if (this.formGroup.contains('emailContentLanguageHtml')) {

          // Remove control
          this.formGroup.removeControl('emailContentLanguageHtml');
          this.emailContentLanguageHtmlSubscription.unsubscribe();
        }

        // Add control
        const formControl = this.formBuilder.group(formControlConfig);
        this.formGroup.addControl('emailContentLanguageHtml', formControl);
        this.emailContentLanguageHtmlSubscription = formControl.valueChanges
          .subscribe(value => {

            // One language was updated, or all at once, we cannot predict
            const newValue = {
              ...this.proposal.emailContentLanguageHtml,
            };

            Object
              .keys(value)
              .forEach(key => newValue[key] = value[key]);

            this.changeInput.emit({ name: 'emailContentLanguageHtml', value: newValue });
          });
      }

      if (this.formGroup.contains('emailContentLanguageHtml') && !!formControlValue['id'])  {

        // Set default value (will emit change event)
        this.formGroup.get('emailContentLanguageHtml').setValue(formControlValue);
      }
    }

    // Modal is opening
    if (isOpening === true) {

      // Disable/enable sender field
      this.permissions.indexOf(this.PERMISSION_MAILING_SEND_ON_BEHALF) > -1 ?
        this.formGroup.get('senderId').enable() : this.formGroup.get('senderId').disable();

      // Form controls marked as touched so validation will trigger
      Object
        .keys(this.formGroup.controls)
        .forEach((name: keyof MatchingGroupProposalInterface) => {

          this.formGroup.get(name).markAsTouched();
        });
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    if (this.emailContentLanguageIdSubscription) {

      this.emailContentLanguageIdSubscription.unsubscribe();
    }

    if (this.emailContentLanguageHtmlSubscription) {

      this.emailContentLanguageHtmlSubscription.unsubscribe();
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: {
        senderId: this.formGroup.value.senderId,
        emailTemplateId: this.formGroup.value.emailTemplateId,
        emailContentId: this.formGroup.value.emailContentId,
        emailBrochureTypeId: this.formGroup.value.emailBrochureTypeId,
        emailBrochurePrivacyId: this.formGroup.value.emailBrochurePrivacyId,
        emailContentLanguageId: this.formGroup.value.emailContentLanguageId || {},
        emailContentLanguageHtml: this.formGroup.value.emailContentLanguageHtml || {},
      },
    });
  }

  /**
   * Changed value of WYSIWYG
   */
  onChangeWysiwyg(value: string, formControlName: string): void {

    const control = this.formGroup.get(['emailContentLanguageHtml', formControlName].join('.'));

    // Update control value
    control.setValue(value, { emitEvent: true });
  }
}
