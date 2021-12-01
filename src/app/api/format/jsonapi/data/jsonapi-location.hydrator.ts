import { LocationModel } from '../../../../shared/model/location.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiLocationInterface } from './jsonapi-location.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';

export class JsonapiLocationHydrator implements JsonapiHydratorInterface<JsonapiLocationInterface, LocationModel> {

  /**
   * @inheritDoc
   */
  factory(): LocationModel {

    return new LocationModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: LocationModel,
    data: JsonapiLocationInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has no attributes
    if (!data.attributes) {

      return;
    }

    model.name = data.attributes.label || model.name;
  }
}
