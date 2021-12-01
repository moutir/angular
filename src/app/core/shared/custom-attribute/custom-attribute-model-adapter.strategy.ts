import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { arrayMinLengthValidator } from '../../../shared/validator/array-min-length.validator';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { CustomAttributeValueModel } from '../../../shared/model/custom-attribute-value.model';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';

@Injectable()
export class CustomAttributeModelAdapterStrategy extends FormModelAdapterStrategy<CustomAttributeModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    values: {
      factory: (): ModelAbstract => new CustomAttributeValueModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: CustomAttributeModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      name: {
        value: model.name,
        validators: [Validators.required],
      },
      usable: {
        value: model.usable,
        validators: [arrayMinLengthValidator(1)],
      },
      values: {
        value: model.values.map(valueModel => {

          return {
            isRemoved: valueModel.isRemoved,
            label: valueModel.label,
          };
        }),
        validators: [arrayMinLengthValidator(1)],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          label: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
        },
      },
    };
  }
}
