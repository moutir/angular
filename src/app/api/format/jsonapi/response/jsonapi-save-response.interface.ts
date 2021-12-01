import { JsonapiErrorInterface } from '../structure/jsonapi-error.interface';

export interface JsonapiSaveResponseInterface {
  data?: { id: string; };
  errors?: JsonapiErrorInterface[];
}
