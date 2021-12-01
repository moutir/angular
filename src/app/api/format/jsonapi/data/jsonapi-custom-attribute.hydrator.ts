import { CustomAttributeModel } from '../../../../shared/model/custom-attribute.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiCustomAttributeInterface } from './jsonapi-custom-attribute.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { AccountModel } from '../../../../shared/model/account.model';
import { CustomAttributeValueModel } from '../../../../shared/model/custom-attribute-value.model';

export class JsonapiCustomAttributeHydrator implements JsonapiHydratorInterface<JsonapiCustomAttributeInterface, CustomAttributeModel> {

  /**
   * @inheritDoc
   */
  factory(): CustomAttributeModel {

    return new CustomAttributeModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: CustomAttributeModel,
    data: JsonapiCustomAttributeInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.name = data.attributes.title || model.name;
      model.createDate = data.attributes.created ? new Date(data.attributes.created) : model.createDate;
      model.updateDate = data.attributes.updated ? new Date(data.attributes.updated) : model.updateDate;
      model.usable = data.attributes.restrictions || model.usable;
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

        // Has relationship created_by
        if (relationship === 'created_by') {

          const userCreate = modelStore.getModel<AccountModel>('accounts', data.relationships.created_by.data.id);

          model.createContact = userCreate.contact;
        }

        // Has relationship updated_by
        if (relationship === 'updated_by') {

          const userUpdate = modelStore.getModel<AccountModel>('accounts', data.relationships.updated_by.data.id);

          model.updateContact = userUpdate.contact;
        }

        // Has relationship custom_attribute_values
        if (relationship === 'custom_attribute_values') {

          model.values = [];

          data.relationships.custom_attribute_values.data.forEach(relData => {

            model.values.push(
              modelStore.getModel<CustomAttributeValueModel>('custom_attribute_values', relData.id),
            );
          });
        }
      });
  }
}
