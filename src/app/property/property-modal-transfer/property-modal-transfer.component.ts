import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyTransferInterface } from '../../shared/interface/property-transfer.interface';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { PropertyTransferOptionsInterface } from '../../shared/interface/property-transfer-options.interface';

@Component({
  selector: 'app-property-modal-transfer',
  templateUrl: './property-modal-transfer.component.html',
  styleUrls: ['./property-modal-transfer.component.scss'],
})
export class PropertyModalTransferComponent extends
  ModalComponentAbstract<PropertyTransferInterface> implements OnInit, OnDestroy, OnChanges {

  /**
   * Transfer state
   */
  @Input() transfer: PropertyTransferInterface;

  /**
   * Form options
   */
  @Input() options: PropertyTransferOptionsInterface;

  /**
   * Changed input
   */
  @Output() changeInput: EventEmitter<InputFormInterface> = new EventEmitter<InputFormInterface>();

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

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
      agencyId: [this.transfer.agencyId],
      brokerId: [this.transfer.brokerId],
      propertyIds: [this.transfer.propertyIds],
    });

    // Form controls change subscriptions
    Object
      .keys(this.formGroup.controls)
      .forEach((name: keyof PropertyTransferInterface) => {

        this.subscriptions.push(
          this.formGroup.get(name).valueChanges.subscribe(value => {

            this.changeInput.emit({
              name,
              value,
            });
          }),
        );
      });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Form state changed
    if (this.formGroup && changes.transfer) {

      // Is opening the modal
      const isOpening = changes.isVisible !== undefined &&
        changes.isVisible.previousValue === false &&
        changes.isVisible.currentValue === true;

      // Patch values
      this.formGroup.patchValue(this.transfer, { emitEvent: isOpening });
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: {
        propertyIds: this.formGroup.value.propertyIds,
        agencyId: this.formGroup.value.agencyId,
        brokerId: this.formGroup.value.brokerId,
      },
    });
  }
}
