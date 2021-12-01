import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { JsonapiCustomAttributeValueInterface } from './jsonapi-custom-attribute-value.interface';
import { CustomAttributeValueModel } from '../../../../shared/model/custom-attribute-value.model';

export class JsonapiCustomAttributeValueHydrator implements JsonapiHydratorInterface<
  JsonapiCustomAttributeValueInterface,
  CustomAttributeValueModel
> {

  /**
   * @inheritDoc
   */
  factory(): CustomAttributeValueModel {

    return new CustomAttributeValueModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: CustomAttributeValueModel,
    data: JsonapiCustomAttributeValueInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.label = data.attributes.value || model.label;
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

        // Has relationship custom_attributes
        if (relationship === 'custom_attribute') {

          model.customAttributeId = data.relationships.custom_attribute.data.id;
        }
      });
  }
}
