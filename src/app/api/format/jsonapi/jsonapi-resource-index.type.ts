import { JsonapiResourceType } from './structure/jsonapi-resource.type';

export type JsonapiResourceIndexType<Value> = {
  [k in JsonapiResourceType]: Value;
};
