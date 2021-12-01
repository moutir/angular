import { JsonapiGetRequestInterface } from '../../format/jsonapi/request/jsonapi-get-request.interface';

export interface ContractGetRequestInterface extends JsonapiGetRequestInterface {
  fields?: {
    property_contracts: string[];
    properties: string[];
    property_contract_actors: string[];
    property_contract_commissions: string[];
    agencies: string[];
    accounts: string[];
    contacts: string[];
  };
  filter?: {
    reference?: string;
    step?: string;
    'property.id'?: string;
    'contacts.id'?: string;
  };
}
