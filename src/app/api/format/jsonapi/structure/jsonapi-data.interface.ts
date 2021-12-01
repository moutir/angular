import { KeyValueType } from '../../../../shared/type/key-value.type';
import { JsonapiRelationshipInterface } from './jsonapi-relationship.interface';
import { JsonapiResourceType } from './jsonapi-resource.type';

export interface JsonapiDataInterface {
  id: string;
  type: JsonapiResourceType;
  attributes?: KeyValueType<string, string|number|boolean|null|string[]|number[]|boolean[]|Object>;
  relationships?: KeyValueType<string, JsonapiRelationshipInterface<JsonapiDataInterface|JsonapiDataInterface[]|null>>;
}
