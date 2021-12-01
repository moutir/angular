import { PropertyModel } from '../../../../shared/model/property.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiPropertyInterface } from './jsonapi-property.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';

export class JsonapiPropertyHydrator implements JsonapiHydratorInterface<JsonapiPropertyInterface, PropertyModel> {

  /**
   * @inheritDoc
   */
  factory(): PropertyModel {

    return new PropertyModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: PropertyModel,
    data: JsonapiPropertyInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has no attributes
    if (!data.attributes) {

      return;
    }

    model.reference = data.attributes.reference || model.reference;
  }
}
