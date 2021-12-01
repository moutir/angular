import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { LeadModel } from '../../../shared/model/lead.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { Dictionary } from '../../../shared/class/dictionary';
import { LeadStatusEnum } from '../../../shared/enum/lead-status.enum';

@Injectable()
export class LeadModelValidationAdapterStrategy extends FormModelAdapterStrategy<LeadModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: LeadModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      validationOptionId: {
        value: model.validationOptionId,
        validators: [],
        updateOn: 'change',
      },
      validationContact: {
        value: model.validationContact.id,
        validators: [],
        updateOn: 'change',
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: LeadModel, formGroup: FormGroup, path: string, value: Object|Object[]): LeadModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Validation option update
    if (path === 'validationOptionId') {

      newModel.validationContact = new ContactModel();
    }

    // Validation option update (Contact save)
    if (path === 'validationOptionId' && value === 1) {

      newModel.validationContact = newModel.contact.clone();
    }

    // Validation contact update
    if (path === 'validationContact') {

      // ID
      if (typeof(value) === 'string') {

        newModel.validationContact = model.matchingContacts.find(contact => contact.id === value) || new ContactModel();

        return newModel;
      }

      newModel.validationContact = <ContactModel>value;
    }

    return newModel;
  }

  /**
   * @inheritDoc
   */
  validate(model: LeadModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {
      validationOptionId: null,
      validationContact: null,
    };

    if (model.statusId === LeadStatusEnum.cancelled || model.statusId === LeadStatusEnum.ignored) {

      return error;
    }

    error.validationOptionId = !model.validationOptionId ? 'required' : null;
    error.validationContact = model.validationOptionId !== 1 && !model.validationContact.id ? 'required' : null;

    return error;
  }
}
