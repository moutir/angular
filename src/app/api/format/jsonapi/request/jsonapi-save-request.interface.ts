import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';

export interface JsonapiSaveRequestInterface<Data extends JsonapiDataInterface> {
  data: Data;
}
