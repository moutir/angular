import { ContactModel } from '../../../../shared/model/contact.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiContactInterface } from './jsonapi-contact.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { ContactEmailModel } from '../../../../shared/model/contact-email.model';

export class JsonapiContactHydrator implements JsonapiHydratorInterface<JsonapiContactInterface, ContactModel> {

  /**
   * @inheritDoc
   */
  factory(): ContactModel {

    return new ContactModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: ContactModel,
    data: JsonapiContactInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has no attributes
    if (!data.attributes) {

      return;
    }

    model.firstName = data.attributes.first_name || model.firstName;
    model.lastName = data.attributes.last_name || model.lastName;
    model.fullName = model.getFullName() || [model.firstName, model.lastName].join(' ').trim();
    model.initials = (model.firstName[0] || '') + (model.lastName[0] || '');
    model.birthDate = data.attributes.birthday ? new Date(data.attributes.birthday) : model.birthDate;
    model.createDate = data.attributes.created ? new Date(data.attributes.created) : model.createDate;
    model.updateDate = data.attributes.updated ? new Date(data.attributes.updated) : model.updateDate;

    // Emails
    (data.attributes.emails || []).forEach(email => {

      const emailModel = new ContactEmailModel();

      emailModel.emailId = email.value;
      emailModel.isMainEmail = email.main;
      emailModel.isInvalid = email.invalid;
      emailModel.notes = email.notes;

      model.emails.push(emailModel);
    });
  }
}
