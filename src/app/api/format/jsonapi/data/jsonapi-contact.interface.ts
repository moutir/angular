import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiAgencyInterface } from './jsonapi-agency.interface';
import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';

export interface JsonapiContactInterface extends JsonapiDataInterface {
  id: string;
  type: 'contacts';
  attributes?: {
    first_name?: string;
    last_name?: string;
    birthday?: string;
    reference?: string;
    archived?: boolean;
    created?: string;
    updated?: string;
    emails?: Array<{
      value: string;
      invalid: boolean;
      main: boolean;
      notes: string;
    }>;
  };
  relationships?: {
    agency?: JsonapiRelationshipInterface<JsonapiAgencyInterface>;
  };
}
