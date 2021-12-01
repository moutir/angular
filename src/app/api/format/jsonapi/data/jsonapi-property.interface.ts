import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiPropertyInterface extends JsonapiDataInterface {
  id: string;
  type: 'properties';
  attributes?: {
    reference?: string;
  };
}
