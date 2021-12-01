import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiContactInterface } from './jsonapi-contact.interface';

export interface JsonapiAccountInterface extends JsonapiDataInterface {
  id: string;
  type: 'accounts';
  relationships?: {
    contact?: JsonapiRelationshipInterface<JsonapiContactInterface>;
  };
}
