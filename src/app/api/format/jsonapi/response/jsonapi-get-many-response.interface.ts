import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiGetManyResponseInterface<JsonapiData extends JsonapiDataInterface> {
  data: JsonapiData[];
  included?: JsonapiDataInterface[];
  meta: {
    total_count: number;
  };
}
