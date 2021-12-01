import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiGetOneResponseInterface<JsonapiData extends JsonapiDataInterface> {
  data: JsonapiData;
  included?: JsonapiDataInterface[];
}
