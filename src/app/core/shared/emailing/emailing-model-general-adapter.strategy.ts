import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { Dictionary } from '../../../shared/class/dictionary';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { DocumentModel } from '../../../shared/model/document.model';

@Injectable()
export class EmailingModelGeneralAdapterStrategy extends FormModelAdapterStrategy<EmailingModel> {

  /**
   * @inheritDoc
   */
  validate(model: EmailingModel): Dictionary<string|null> {

    const error: Dictionary<string> = {};

    error.recipients = model.recipients.length === 0 ? 'arrayMinLength_1' : null;
    error.reminderContact = model.isReminderAdded && !model.reminderContact ? 'required' : null;
    error.reminderDate = model.isReminderAdded && !model.reminderDate ? 'required' : null;
    error.reminderTime = model.isReminderAdded && !model.reminderTime ? 'required' : null;

    return error;
  }

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: EmailingModel): KeyValueType<string, FormControlConfigInterface> {

    const formControlConfig: KeyValueType<string, FormControlConfigInterface> = {
      senderId: {
        value: model.sender.id,
        validators: [],
      },
      recipients: {
        value: model.recipients,
        validators: [Validators.required],
      },
      defaultLanguageId: {
        value: model.defaultLanguageId,
        validators: [],
      },
      emailContentId: {
        value: model.emailContentId,
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
      emailBrochureTypeId: {
        value: model.emailBrochureTypeId,
        validators: [],
      },
      emailBrochurePrivacyId: {
        value: model.emailBrochurePrivacyId,
        validators: [],
      },
      brochureBrokerId: {
        value: model.brochureBrokerId,
        validators: [],
      },
      emailTemplateId: {
        value: model.emailTemplateId,
        validators: [],
      },
      isCopiedToSender: {
        value: model.isCopiedToSender,
        validators: [],
        updateOn: 'change',
      },
      isCopiedToBrokers: {
        value: model.isCopiedToBrokers,
        validators: [],
        updateOn: 'change',
      },
      isPriceHidden: {
        value: model.isPriceHidden,
        validators: [],
        updateOn: 'change',
      },
      isReminderAdded: {
        value: model.isReminderAdded,
        validators: [],
        updateOn: 'change',
      },
      reminderContact: {
        value: model.reminderContact,
        validators: [],
        updateOn: 'change',
      },
      reminderDate: {
        value: model.reminderDate,
        validators: [],
      },
      reminderTime: {
        value: model.reminderTime,
        validators: [],
      },
      isLeadClosed: {
        value: model.isLeadClosed,
        validators: [],
      },
    };

    // Documents
    Object.keys(model.documents).forEach(key => {

      const segments = key.split('_');
      const fieldName = this.getDocumentFieldUid(<EntityEnum>segments[0], segments[1]);

      formControlConfig[fieldName] = {
        value: model.documents[key].map(doc => doc.id),
        validators: [],
      };
    });

    return formControlConfig;
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: EmailingModel,
    formGroup: FormGroup,
    path: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): EmailingModel {

    // Clone model
    const newModel = super.getModel(model, formGroup, path, value);

    // Sender
    if (path === 'senderId') {

      const newSenderModel = newModel.sender.clone<ContactModel>();
      newSenderModel.id = <string>value;
      newModel.sender = newSenderModel;
    }

    const isDocumentField = path.match(/^document_([a-zA-Z]+)_/) !== null;

    // Promotions
    if (path === 'promotions') {

      const hasPromotions = (value as PromotionModel[]).length > 0;

      newModel.emailBrochureTypeId = '1';
      newModel.emailBrochurePrivacyId = '0';
      newModel.emailTemplateId = hasPromotions ? '6' : '2';
    }

    // Document field
    if (isDocumentField) {

      const newDocs = (value as string[]).map(id => {

        const docModel = new DocumentModel();
        docModel.id = id;

        return docModel;
      });

      const segments = path.split('_');
      path = [segments[1], segments[2]].join('_');

      newModel.documents = {
        ...newModel.documents,
        [path]: newDocs,
      };

      return newModel;
    }

    return newModel;
  }

  /**
   * Return a document field UID
   */
  getDocumentFieldUid(entity: EntityEnum, id: string): string {

    return ['document', entity, id].join('_');
  }
}
