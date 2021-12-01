import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { ReportGenerationModel } from '../../../shared/model/report-generation.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class ReportGenerationModelAdapterStrategy extends FormModelAdapterStrategy<ReportGenerationModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: ReportGenerationModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig = super.getFormControlConfig(model);

    formControlConfig['startDate'].validators = [Validators.required];

    return formControlConfig;
  }

  /**
   * @inheritDoc
   */
  validate(model: ReportGenerationModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};

    error.endDate = (model.startDate && model.endDate && model.startDate > model.endDate) ? 'feedback_date_end_small' : null;

    return error;
  }
}
