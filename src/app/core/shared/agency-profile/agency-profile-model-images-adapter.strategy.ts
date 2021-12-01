import { Injectable } from '@angular/core';

import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { AgencyModel } from '../../../shared/model/agency.model';
import { DocumentModel } from '../../../shared/model/document.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class AgencyProfileModelImagesAdapterStrategy extends FormModelAdapterStrategy<AgencyModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: AgencyModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig: KeyValueType<string, FormControlConfigInterface> = {
      watermarkOpacity: {
        value: model.watermarkOpacity,
        validators: [],
        updateOn: 'change',
      },
      isAppliedWatermarkOnBrochure: {
        value: model.isAppliedWatermarkOnBrochure,
        validators: [],
        updateOn: 'change',
      },
      isAppliedWatermarkOnPortal: {
        value: model.isAppliedWatermarkOnPortal,
        validators: [],
        updateOn: 'change',
      },
      isAppliedWatermarkOnWebsite: {
        value: model.isAppliedWatermarkOnWebsite,
        validators: [],
        updateOn: 'change',
      },
    };

    model.IMAGE_DOCUMENT_ATTRIBUTES.forEach(attribute => {

      const document: DocumentModel = <DocumentModel>model[attribute];

      if (!document) {

        return;
      }

      Object.keys(document.data).forEach(key => {

        formControlConfig[attribute + '_' + key] = {
          value: document.data[key],
          validators: [],
        };
      });
    });

    return formControlConfig;
  }

  /**
   * Return a field UID
   */
  getFieldUid(modelAttribute: string, field: string, language?: string): string {

    return [modelAttribute, field, language].filter(Boolean).join('_');
  }
}
