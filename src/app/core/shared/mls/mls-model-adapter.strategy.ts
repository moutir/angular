import { FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { MlsModel } from '../../../shared/model/mls.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class MlsModelAdapterStrategy extends FormModelAdapterStrategy<MlsModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: MlsModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      partnerAgencyId: {
        value: model.partnerAgency.id,
        validators: [Validators.required],
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: MlsModel, formGroup: FormGroup, path: string, value: Object|Object[]): MlsModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Partner update
    if (path === 'partnerAgencyId' && model.partnerAgency.id !== <string>value) {

      newModel.partnerAgency.id = <string>value;
      newModel.partnerAgency.name = '';
      newModel.partnerAgency.isAllowedSendMLSInvite = false;
    }

    return newModel;
  }
}
