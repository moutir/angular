import { KeyValueType } from '../../../../shared/type/key-value.type';
import { JsonapiPaginationInterface } from '../structure/jsonapi-pagination.interface';

export interface JsonapiGetRequestInterface {
  fields?: KeyValueType<string, string[]>;
  include?: string[];
  filter?: KeyValueType<string, string>;
  page?: JsonapiPaginationInterface;
}
