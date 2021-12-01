import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiContactEmailInterface extends JsonapiDataInterface {
  id: string;
  type: 'emails';
  attributes?: {
    value?: string;
    is_invalid?: boolean;
    is_main?: boolean;
  };
}
