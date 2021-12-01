import { JsonapiGetRequestInterface } from '../../format/jsonapi/request/jsonapi-get-request.interface';

export interface AccountGetRequestInterface extends JsonapiGetRequestInterface {
  fields?: {
    accounts: string[];
    contacts: string[];
  };
  filter?: {
    allow_emails_on_behalf?: string; // 0, 1
  };
}
