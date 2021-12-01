import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { ContactTransferActivityInterface } from '../../shared/interface/contact-transfer-activity.interface';
import { ContactTransferActivityOptionsInterface } from '../../shared/interface/contact-transfer-activity-options.interface';
import { ContactModel } from '../../shared/model/contact.model';

@Component({
  selector: 'app-contact-modal-transfer-activity',
  templateUrl: './contact-modal-transfer-activity.component.html',
  styleUrls: ['./contact-modal-transfer-activity.component.scss'],
})
export class ContactModalTransferActivityComponent extends
  ModalComponentAbstract<ContactTransferActivityInterface> implements OnInit, OnChanges {

  /**
   * Selected contact model
   */
  @Input() contact: ContactModel|null;

  /**
   * Transfer activity state
   */
  @Input() transferActivity: ContactTransferActivityInterface;

  /**
   * Form options
   */
  @Input() options: ContactTransferActivityOptionsInterface;

  /**
   * Changed input
   */
  @Output() changeInput: EventEmitter<InputFormInterface> = new EventEmitter<InputFormInterface>();

  /**
   * Form group
   */
  formGroup: FormGroup;

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
      contactId: [this.transferActivity.contactId],
      brokerId: [this.transferActivity.brokerId, Validators.required],
      isAgreed: [this.transferActivity.isAgreed, Validators.requiredTrue],
      isActiveArchive: [this.transferActivity.isActiveArchive],
      isAllowedArchive: [this.transferActivity.isAllowedArchive],
    });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Form state changed
    if (this.formGroup && changes.transferActivity) {

      // Is opening the modal
      const isOpening = changes.isVisible !== undefined &&
        changes.isVisible.previousValue === false &&
        changes.isVisible.currentValue === true;

      // Patch values
      this.formGroup.patchValue(this.transferActivity, { emitEvent: isOpening });
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: {
        contactId: this.formGroup.value.contactId,
        brokerId: this.formGroup.value.brokerId,
        isAgreed: this.formGroup.value.isAgreed,
        isActiveArchive: this.formGroup.value.isActiveArchive,
        isAllowedArchive: this.formGroup.value.isAllowedArchive,
      },
    });
  }
}
