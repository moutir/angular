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
export class LeadModelGeneralAdapterStrategy extends FormModelAdapterStrategy<LeadModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: LeadModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      typeId: {
        value: model.typeId,
        validators: [Validators.required],
      },
      statusId: {
        value: model.statusId,
        validators: [Validators.required],
      },
      contactDate: {
        value: model.contactDate,
        validators: [Validators.required],
      },
      contactTime: {
        value: model.contactTime,
        validators: [Validators.required],
      },
      contact: {
        value: model.contact.id,
        validators: [Validators.required],
      },
      mediaId: {
        value: model.mediaId,
        validators: [Validators.required],
      },
      sourceId: {
        value: model.sourceId,
        validators: [Validators.required],
      },
      subSourceId: {
        value: model.subSourceId,
        validators: [],
      },
      brokerId: {
        value: model.broker.id,
        validators: [],
      },
      contactMessage: {
        value: model.contactMessage,
        validators: [],
      },
      properties: {
        value: model.properties,
        validators: [],
      },
      promotions: {
        value: model.promotions,
        validators: [],
      },
      manageDate: {
        value: model.manageDate,
        validators: [],
      },
      manageTime: {
        value: model.manageTime,
        validators: [],
      },
      managementMediaId: {
        value: model.managementMediaId,
        validators: [],
      },
      brokerNotes: {
        value: model.brokerNotes,
        validators: [],
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: LeadModel, formGroup: FormGroup, path: string, value: Object|Object[]): LeadModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Broker update
    if (path === 'brokerId') {

      newModel.broker = new ContactModel();
      newModel.broker.id = String(value);
    }

    // Source update
    if (path === 'sourceId') {

      // Reset sub source
      newModel.subSourceId = '';
    }

    // Contact date update
    if (path === 'contactDate' && !newModel.contactTime) {

      const contactDate = new Date();

      // Set default time
      newModel.contactTime = contactDate.getHours() + ':' + contactDate.getMinutes();
    }

    // Treatment date update
    if (path === 'manageDate' && !newModel.manageTime) {

      const manageDate = new Date();

      // Set default time
      newModel.manageTime = manageDate.getHours() + ':' + manageDate.getMinutes();
    }

    return newModel;
  }

  /**
   * @inheritDoc
   */
  validate(model: LeadModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};
    const isIgnoredOrCancelledLead = model.statusId === LeadStatusEnum.ignored || model.statusId === LeadStatusEnum.cancelled;

    error.contact = !isIgnoredOrCancelledLead && !model.contact.id ? 'required' : null;
    error.contactTime = !model.contactTime ? 'required' : null;

    if (model.isNeedValidation === true && !isIgnoredOrCancelledLead) {

      error.contact = 'required_contact_validation';
    }

    return error;
  }
}
