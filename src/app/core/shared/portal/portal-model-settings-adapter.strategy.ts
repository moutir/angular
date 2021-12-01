import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { PortalModel } from '../../../shared/model/portal.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class PortalModelSettingsAdapterStrategy extends FormModelAdapterStrategy<PortalModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: PortalModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      isActiveMarketingExpense: {
        value: model.isActiveMarketingExpense,
        validators: [],
      },
      marketingMonthly: {
        value: model.marketingMonthly,
        validators: [],
      },
      marketingPrice: {
        value: model.marketingPrice,
        validators: [],
      },
      topListing: {
        value: model.topListing,
        validators: [],
      },
      maxPictures: {
        value: model.maxPictures,
        validators: [Validators.required],
      },
    };
  }
}
