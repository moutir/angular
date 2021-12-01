import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyBrochureInterface } from '../../shared/interface/property-brochure.interface';
import { PropertyBrochureOptionsInterface } from '../../shared/interface/property-brochure-options.interface';
import { PropertyModel } from '../../shared/model/property.model';
import { InputFormInterface } from '../../shared/interface/input-form.interface';

@Component({
  selector: 'app-property-modal-brochure',
  templateUrl: './property-modal-brochure.component.html',
  styleUrls: ['./property-modal-brochure.component.scss'],
})
export class PropertyModalBrochureComponent extends
  ModalComponentAbstract<PropertyBrochureInterface> implements OnInit, OnChanges, OnDestroy {

  /**
   * Brochure state
   */
  @Input() brochure: PropertyBrochureInterface;

  /**
   * Form options
   */
  @Input() options: PropertyBrochureOptionsInterface;

  /**
   * Property
   */
  @Input() property: PropertyModel;

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
      typeId: [this.brochure.typeId],
      privacyId: [this.brochure.privacyId],
      quality: [this.brochure.quality],
      language: [this.brochure.language],
      brokerId: [this.brochure.brokerId],
    });

    // Form controls change subscriptions
    Object
      .keys(this.formGroup.controls)
      .forEach((name: keyof PropertyBrochureInterface) => {

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

    // State changed
    if (this.formGroup && changes.brochure) {

      // Patch values (ignore unknown attributes)
      this.formGroup.patchValue(this.brochure, {
        emitEvent: false,
      });
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
        ...this.brochure,
        step: this.brochure.step + (isValid ? 1 : -1),
        typeId: this.formGroup.value.typeId,
        privacyId: this.formGroup.value.privacyId,
        quality: this.formGroup.value.quality,
        language: this.formGroup.value.language,
        brokerId: this.formGroup.value.brokerId,
      },
    });
  }
}
