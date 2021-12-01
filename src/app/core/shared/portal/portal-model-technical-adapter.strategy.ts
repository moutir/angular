import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { PortalModel } from '../../../shared/model/portal.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class PortalModelTechnicalAdapterStrategy extends FormModelAdapterStrategy<PortalModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: PortalModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      ftpTimeout: {
        value: model.ftpTimeout,
        validators: [],
      },
      ftpAttempts: {
        value: model.ftpAttempts,
        validators: [],
      },
      ftpDataFolder: {
        value: model.ftpDataFolder,
        validators: [],
      },
      ftpDocsFolder: {
        value: model.ftpDocsFolder,
        validators: [],
      },
      ftpImagesFolder: {
        value: model.ftpImagesFolder,
        validators: [],
      },
      ftpMoviesFolder: {
        value: model.ftpMoviesFolder,
        validators: [],
      },
    };
  }
}
