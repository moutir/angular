import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { DocumentModel } from '../../shared/model/document.model';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { KeyValueType } from '../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../shared/interface/form-control-config.interface';

@Injectable()
export class DocumentModelAdapterStrategy extends FormModelAdapterStrategy<DocumentModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: DocumentModel): KeyValueType<string, FormControlConfigInterface> {

    const controlConfig = {
      isRemoved: {
        value: false,
        validators: [],
      },
    };

    Object
      .keys(model.data)
      .forEach(key => {

        // Create a default optional control
        controlConfig[key] = {
          value: model.data[key],
          validators: [],
          updateOn: 'blur',
        };
      });

    return controlConfig;
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: DocumentModel,
    formGroup: FormGroup,
    key: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): DocumentModel {

    const newModel = model.clone<DocumentModel>();

    if (key === 'isRemoved') {

      newModel.isRemoved = <boolean>value;

    } else {

      newModel.data = {
        ...newModel.data,
        [key]: value,
      };
    }

    return newModel;
  }
}
