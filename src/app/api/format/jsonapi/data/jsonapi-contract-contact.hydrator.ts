import { ContactModel } from '../../../../shared/model/contact.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { JsonapiContractContactInterface } from './jsonapi-contract-contact.interface';
import { ContractContactModel } from '../../../../shared/model/contract-contact.model';

export class JsonapiContractContactHydrator implements JsonapiHydratorInterface<
  JsonapiContractContactInterface,
  ContractContactModel
> {

  /**
   * @inheritDoc
   */
  factory(): ContractContactModel {

    return new ContractContactModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: ContractContactModel,
    data: JsonapiContractContactInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.typeId = data.attributes.actor_type || model.typeId;
      model.comment = data.attributes.comment || model.comment;
    }

    // Has no relationships
    if (!data.relationships) {

      return;
    }

    // Relationships
    Object
      .keys(data.relationships)
      .filter(relationship => data.relationships[relationship] !== null && data.relationships[relationship].data !== null)
      .forEach(relationship => {

        // Has relationship contact
        if (relationship === 'contact') {

          model.contact = modelStore.getModel<ContactModel>('contacts', data.relationships.contact.data.id);
        }
      });
  }
}
