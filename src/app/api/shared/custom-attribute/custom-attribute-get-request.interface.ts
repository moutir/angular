import { JsonapiGetRequestInterface } from '../../format/jsonapi/request/jsonapi-get-request.interface';

export interface CustomAttributeGetRequestInterface extends JsonapiGetRequestInterface {
  fields?: {
    custom_attributes: string[];
    contacts: string[];
    accounts: string[];
    custom_attribute_values: string[];
  };
  filter?: {
    title?: string;
  };
}
