import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { CustomAttributeOptionsInterface } from '../../shared/interface/custom-attribute-options.interface';
import { CustomAttributeModelAdapterStrategy } from '../../core/shared/custom-attribute/custom-attribute-model-adapter.strategy';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';

@Component({
  selector: 'app-custom-attribute-form-required',
  templateUrl: './custom-attribute-form-required.component.html',
  styleUrls: ['./custom-attribute-form-required.component.scss'],
})
export class CustomAttributeFormRequiredComponent extends FormComponentAbstract<
  CustomAttributeModel,
  CustomAttributeOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: CustomAttributeModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected initialize(): boolean {

    if (super.initialize() === false) {

      return false;
    }

    // New custom attribute
    if (!this.model.id) {

      // Add default value
      this.addFormArrayChild(
        this.formArray['values'].control,
        'values',
        0,
        this.modelAdapterStrategy.getFormControlConfig(this.model)['values'].formArrayConfig,
      );
    }

    return true;
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = {
      emitEvent: false,
    };

    // Disable/enable input based on add/edit status
    this.model.id ? this.formGroup.get('usable').disable(options) : this.formGroup.get('usable').enable(options);
  }
}
