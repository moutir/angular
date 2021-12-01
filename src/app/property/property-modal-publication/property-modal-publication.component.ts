import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyPublicationInterface } from '../../shared/interface/property-publication.interface';
import { PropertyPublicationOptionsInterface } from '../../shared/interface/property-publication-options.interface';

@Component({
  selector: 'app-property-modal-publication',
  templateUrl: './property-modal-publication.component.html',
  styleUrls: ['./property-modal-publication.component.scss'],
})
export class PropertyModalPublicationComponent extends ModalComponentAbstract<PropertyPublicationInterface> implements OnChanges {

  /**
   * Publication state
   */
  @Input() publication: PropertyPublicationInterface;

  /**
   * Form options
   */
  @Input() options: PropertyPublicationOptionsInterface;

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
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Became visible
    if (changes.isVisible && changes.isVisible.currentValue === true) {

      this.updateFormGroup();
    }
  }

  /**
   * Update the form group
   */
  updateFormGroup(): void {

    const formGroup = {
      propertyIds: this.formBuilder.control(this.publication.propertyIds),
    };

    ['websites', 'portals']
      .forEach(key => {

        const isDateEnabled = this.publication[key].dates.from !== null || this.publication[key].dates.to !== null;

        const changesFormGroup = {};
        this.options[key].forEach(option => {

          changesFormGroup[option.value] = this.formBuilder.control(this.publication[key].changes[option.value] || '-1');
        });

        // Group definition
        formGroup[key] = this.formBuilder.group({
          changes: this.formBuilder.group(changesFormGroup),
          dates: this.formBuilder.group({
            period: this.formBuilder.control(isDateEnabled ? '1' : '0'),
            from: this.formBuilder.control({
              value: this.publication[key].dates.from,
              disabled: isDateEnabled === false,
            }),
            to: this.formBuilder.control({
              value: this.publication[key].dates.to,
              disabled: isDateEnabled === false,
            }),
          }),
        });
      });

    // Update form group
    this.formGroup = this.formBuilder.group(formGroup);
  }

  /**
   * Toggle datepickers enabled/disabled based on the selection value
   */
  toggleDatepickers(groupName: string, value: string): void {

    ['from', 'to'].forEach(fieldName => {

      const field = this.formGroup.get(groupName + '.' + fieldName);

      value === '1' ? field.enable() : field.disable();
    });
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    const publication: PropertyPublicationInterface = {
      propertyIds: this.formGroup.value.propertyIds,
      websites: {
        changes: {},
        dates: {
          from: this.formGroup.value.websites.dates.from || null,
          to: this.formGroup.value.websites.dates.to || null,
        },
      },
      portals: {
        changes: {},
        dates: {
          from: this.formGroup.value.portals.dates.from || null,
          to: this.formGroup.value.portals.dates.to || null,
        },
      },
    };

    ['websites', 'portals']
      .forEach(key => {

        Object
          .keys(this.formGroup.value[key].changes)
          .forEach(id => {

            // Remove default values
            if (this.formGroup.value[key].changes[id] === '-1') {

              return;
            }

            publication[key].changes[id] = this.formGroup.value[key].changes[id];
        });
    });

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: publication,
    });
  }

  /**
   * Period changed
   */
  onChangeDatePeriod(groupName: string, event: MatRadioChange): void {

    this.toggleDatepickers(groupName, event.value);
  }
}
