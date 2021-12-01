import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { ContactModifyBrokerInterface } from '../../shared/interface/contact-modify-broker.interface';
import { ContactModifyBrokerOptionsInterface } from '../../shared/interface/contact-modify-broker-options.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-contact-modal-modify-broker',
  templateUrl: './contact-modal-modify-broker.component.html',
  styleUrls: ['./contact-modal-modify-broker.component.scss'],
})
export class ContactModalModifyBrokerComponent extends
  ModalComponentAbstract<ContactModifyBrokerInterface> implements OnInit, OnChanges {

  /**
   * Modify broker state
   */
  @Input() modifyBroker: ContactModifyBrokerInterface;

  /**
   * Form options
   */
  @Input() options: ContactModifyBrokerOptionsInterface;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Changed input
   */
  @Output() changeInput: EventEmitter<InputFormInterface> = new EventEmitter<InputFormInterface>();

  /**
   * Constants
   */
  readonly PERMISSION_AGENCY_GROUP_ADMIN: PermissionEnum = PermissionEnum.agencyGroupAdmin;

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
      brokerId: [this.modifyBroker.brokerId],
      rentalBrokerId: [this.modifyBroker.rentalBrokerId],
      saleBrokerId: [this.modifyBroker.saleBrokerId],
      contactIds: [this.modifyBroker.contactIds],
      searchManagerId: [this.modifyBroker.searchManagerId],
      specificContactId: [{ value: this.modifyBroker.specificContactId, disabled: true }],
      isSpecificContact: [false],
    });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Form state changed
    if (this.formGroup && changes.modifyBroker) {

      // Is opening the modal
      const isOpening = changes.isVisible !== undefined &&
        changes.isVisible.previousValue === false &&
        changes.isVisible.currentValue === true;

      // Patch values
      this.formGroup.patchValue(this.modifyBroker, { emitEvent: isOpening });

      if (isOpening) {

        this.formGroup.get('isSpecificContact').setValue(false);
        this.formGroup.get('specificContactId').disable();
      }
    }
  }

  /**
   * Toggle field enabled/disabled based on the checkbox value
   */
  toggleFieldMatchContact(isChecked: boolean): void {

    const field = this.formGroup.get('specificContactId');

    if (isChecked) {

      field.setValidators([Validators.required]);
      field.enable();
     } else {

      field.setValidators(null);
      field.disable();
     }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: {
        brokerId: this.formGroup.value.brokerId,
        rentalBrokerId: this.formGroup.value.rentalBrokerId,
        saleBrokerId: this.formGroup.value.saleBrokerId,
        contactIds: this.formGroup.value.contactIds,
        searchManagerId: this.formGroup.value.searchManagerId,
        specificContactId: this.formGroup.value.specificContactId,
      },
    });
  }

  /**
   * Checkbox changed
   */
  onChangeMatchContact(event: MatCheckboxChange): void {

    this.toggleFieldMatchContact(event.checked);
  }
}
