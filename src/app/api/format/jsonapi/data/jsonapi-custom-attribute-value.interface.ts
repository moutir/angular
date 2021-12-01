import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiCustomAttributeInterface } from './jsonapi-custom-attribute.interface';

export interface JsonapiCustomAttributeValueInterface extends JsonapiDataInterface {
  id: string;
  type: 'custom_attribute_values';
  attributes?: {
    value?: string;
  };
  relationships?: {
    custom_attribute?: JsonapiRelationshipInterface<JsonapiCustomAttributeInterface>;
  };
}
