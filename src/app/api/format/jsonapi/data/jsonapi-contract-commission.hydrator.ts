import { ContactModel } from '../../../../shared/model/contact.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { JsonapiContractCommissionInterface } from './jsonapi-contract-commission.interface';
import { ContractCommissionModel } from '../../../../shared/model/contract-commission.model';

export class JsonapiContractCommissionHydrator implements JsonapiHydratorInterface<
  JsonapiContractCommissionInterface,
  ContractCommissionModel
> {

  /**
   * @inheritDoc
   */
  factory(): ContractCommissionModel {

    return new ContractCommissionModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: ContractCommissionModel,
    data: JsonapiContractCommissionInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.typeId = data.attributes.commission_type || model.typeId;
      model.amount = data.attributes.amount || model.amount;
      model.invoice = data.attributes.invoice_number || model.invoice;
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

        // Has relationship deduct_from
        if (relationship === 'deduct_from') {

          model.parentContractCommissionId = data.relationships.deduct_from.data.id;
        }
      });
  }
}
