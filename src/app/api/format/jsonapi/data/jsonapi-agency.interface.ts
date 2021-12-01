import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiAgencyInterface extends JsonapiDataInterface {
  id: string;
  type: 'agencies';
}
