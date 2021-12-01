import { ContactEmailModel } from '../../../../shared/model/contact-email.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiContactEmailInterface } from './jsonapi-contact-email.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';

export class JsonapiContactEmailHydrator implements JsonapiHydratorInterface<JsonapiContactEmailInterface, ContactEmailModel> {

  /**
   * @inheritDoc
   */
  factory(): ContactEmailModel {

    return new ContactEmailModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: ContactEmailModel,
    data: JsonapiContactEmailInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.emailId = data.attributes.value || model.emailId;
      model.isInvalid = data.attributes.hasOwnProperty('is_invalid') ? data.attributes.is_invalid : model.isInvalid;
      model.isMainEmail = data.attributes.hasOwnProperty('is_main') ? data.attributes.is_main : model.isMainEmail;
    }
  }
}
