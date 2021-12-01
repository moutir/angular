import { ModelAbstract } from '../../../shared/class/model.abstract';
import { JsonapiDataInterface } from './structure/jsonapi-data.interface';
import { JsonapiModelStore } from './jsonapi-model-store';

export interface JsonapiHydratorInterface<
  Data extends JsonapiDataInterface,
  Model extends ModelAbstract
> {

  /**
   * Returns an instance of a new model
   */
  factory(): Model;

  /**
   * Hydrate the model based on data
   */
  hydrate(model: Model, data: Data, modelStore: JsonapiModelStore): void;
}
