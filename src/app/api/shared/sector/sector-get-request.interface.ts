import { JsonapiGetRequestInterface } from '../../format/jsonapi/request/jsonapi-get-request.interface';

export interface SectorGetRequestInterface extends JsonapiGetRequestInterface {
  fields?: {
    sectors: string[];
    locations: string[];
    contacts: string[];
    accounts: string[];
  };
  filter?: {
    name?: string;
  };
}
