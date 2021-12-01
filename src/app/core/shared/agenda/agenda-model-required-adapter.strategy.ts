import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { AgendaModel } from '../../../shared/model/agenda.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class AgendaModelRequiredAdapterStrategy extends FormModelAdapterStrategy<AgendaModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: AgendaModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      calendarId: {
        value: model.calendarId,
        validators: [Validators.required],
        updateOn: 'change',
      },
    };
  }
}
