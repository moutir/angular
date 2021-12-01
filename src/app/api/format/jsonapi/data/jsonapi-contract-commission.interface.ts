import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiContactInterface } from './jsonapi-contact.interface';
import { JsonapiContractInterface } from './jsonapi-contract.interface';

export interface JsonapiContractCommissionInterface extends JsonapiDataInterface {
  id: string;
  type: 'property_contract_commissions';
  attributes?: {
    commission_type?: string;
    amount?: number;
    invoice_number?: string;
    comment?: string;
  };
  relationships?: {
    contact?: JsonapiRelationshipInterface<JsonapiContactInterface>;
    property_contract?: JsonapiRelationshipInterface<JsonapiContractInterface>;
    deduct_from?: JsonapiRelationshipInterface<JsonapiContractCommissionInterface>;
  };
}
