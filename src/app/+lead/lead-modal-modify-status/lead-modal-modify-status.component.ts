import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { LeadModifyStatusInterface } from '../../shared/interface/lead-modify-status.interface';
import { LeadModifyStatusOptionsInterface } from '../../shared/interface/lead-modify-status-options.interface';

@Component({
  selector: 'app-lead-modal-modify-status',
  templateUrl: './lead-modal-modify-status.component.html',
  styleUrls: ['./lead-modal-modify-status.component.scss'],
})
export class LeadModalModifyStatusComponent extends
  ModalComponentAbstract<LeadModifyStatusInterface> implements OnInit, OnChanges {

  /**
   * Modify status state
   */
  @Input() modifyStatus: LeadModifyStatusInterface;

  /**
   * Form options
   */
  @Input() options: LeadModifyStatusOptionsInterface;

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
      leadIds: [this.modifyStatus.leadIds],
      statusId: [this.modifyStatus.statusId, [Validators.required]],
    });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Form state changed
    if (this.formGroup && changes.modifyStatus) {

      // Is opening the modal
      const isOpening = changes.isVisible !== undefined &&
        changes.isVisible.previousValue === false &&
        changes.isVisible.currentValue === true;

      // Patch values
      this.formGroup.patchValue(this.modifyStatus, { emitEvent: isOpening });
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: {
        leadIds: this.formGroup.value.leadIds,
        statusId: this.formGroup.value.statusId,
      },
    });
  }
}
