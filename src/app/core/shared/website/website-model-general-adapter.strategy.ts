import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { Dictionary } from '../../../shared/class/dictionary';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { WebsiteModel } from '../../../shared/model/website.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { arrayMinLengthValidator } from '../../../shared/validator/array-min-length.validator';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class WebsiteModelGeneralAdapterStrategy extends FormModelAdapterStrategy<WebsiteModel> {

  /**
   * @inheritDoc
   */
  validate(model: WebsiteModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};

    error.layoutId = model.isInternal && !model.layoutId ? 'required' : null;
    error.templateId = model.isInternal && !model.templateId ? 'required' : null;

    return error;
  }

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: WebsiteModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      url: {
        value: model.url,
        validators: [Validators.required],
      },
      layoutId: {
        value: model.layoutId,
        validators: [],
      },
      templateId: {
        value: model.templateId,
        validators: [],
      },
      alternativeDomain: {
        value: model.alternativeDomain,
        validators: [],
      },
      defaultLanguageId: {
        value: model.defaultLanguageId,
        validators: [],
      },
      availableLanguageIds: {
        value: model.availableLanguageIds,
        validators: [arrayMinLengthValidator(1)],
      },
      brokerIds: {
        value: model.brokers.map(broker => broker.id),
        validators: [],
      },
      facebookAppId: {
        value: model.facebookAppId,
        validators: [],
      },
      googleAnalyticsAppId: {
        value: model.googleAnalyticsAppId,
        validators: [],
      },
      isInternal: {
        value: model.isInternal,
        validators: [],
        updateOn: 'change',
      },
      isActive: {
        value: model.isActive,
        validators: [],
        updateOn: 'change',
      },
      isActiveFisher: {
        value: model.isActiveFisher,
        validators: [],
        updateOn: 'change',
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: WebsiteModel, formGroup: FormGroup, path: string, value: Object|Object[]): WebsiteModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Brokers
    if (path === 'brokerIds') {

      newModel.brokers = (value as string[] || []).map(id => {

        const contact = new ContactModel();
        contact.id = id;

        return contact;
      });

      return newModel;
    }

    return newModel;
  }
}
