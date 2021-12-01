import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiLocationInterface extends JsonapiDataInterface {
  id: string;
  type: 'locations';
  attributes?: {
    label?: string;
  };
}
