import { Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { SectorModel } from '../../../shared/model/sector.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class SectorModelAdapterStrategy extends FormModelAdapterStrategy<SectorModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: SectorModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      name: {
        value: model.name,
        validators: [Validators.required],
      },
      locations: {
        value: model.locations,
        validators: [],
      },
      polygons: {
        value: model.polygons,
        validators: [],
      },
    };
  }

  /**
   * @inheritDoc
   */
  validate(model: SectorModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error = super.validate(model, currentError);

    error.locations_polygons = model.locations.length === 0 &&
                               model.polygons.length === 0 ?
                               'locations_polygons' : null;

    return error;
  }
}
