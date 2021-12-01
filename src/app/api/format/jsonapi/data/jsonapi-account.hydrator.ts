import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiAccountInterface } from './jsonapi-account.interface';
import { AccountModel } from '../../../../shared/model/account.model';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { ContactModel } from '../../../../shared/model/contact.model';

export class JsonapiAccountHydrator implements JsonapiHydratorInterface<JsonapiAccountInterface, AccountModel> {

  /**
   * @inheritDoc
   */
  factory(): AccountModel {

    return new AccountModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: AccountModel,
    data: JsonapiAccountInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has no relationships
    if (!data.relationships) {

      return;
    }

    // Relationships
    Object
      .keys(data.relationships)
      .filter(relationship => data.relationships[relationship].data !== null)
      .forEach(relationship => {

        // Has relationship contact
        if (relationship === 'contact') {

          model.contact = modelStore.getModel<ContactModel>('contacts', data.relationships.contact.data.id) || model.contact;
          model.contact.accountId = model.id;
        }
      });
  }
}
