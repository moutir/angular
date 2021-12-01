import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiContactInterface } from './jsonapi-contact.interface';
import { JsonapiContractInterface } from './jsonapi-contract.interface';

export interface JsonapiContractContactInterface extends JsonapiDataInterface {
  id: string;
  type: 'property_contract_actors';
  attributes?: {
    actor_type?: string;
    comment?: string;
  };
  relationships?: {
    contact?: JsonapiRelationshipInterface<JsonapiContactInterface>;
    property_contract?: JsonapiRelationshipInterface<JsonapiContractInterface>;
  };
}
