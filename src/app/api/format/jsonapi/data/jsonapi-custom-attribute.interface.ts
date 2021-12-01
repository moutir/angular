import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiAgencyInterface } from './jsonapi-agency.interface';
import { JsonapiAccountInterface } from './jsonapi-account.interface';
import { CustomAttributeTypeEnum } from '../../../../shared/enum/custom-attribute-type.enum';
import { JsonapiCustomAttributeValueInterface } from './jsonapi-custom-attribute-value.interface';

export interface JsonapiCustomAttributeInterface extends JsonapiDataInterface {
  id: string;
  type: 'custom_attributes';
  attributes?: {
    title?: string;
    created?: string;
    updated?: string|null;
    values?: string[];
    restrictions?: CustomAttributeTypeEnum[];
  };
  relationships?: {
    agency?: JsonapiRelationshipInterface<JsonapiAgencyInterface>;
    created_by?: JsonapiRelationshipInterface<JsonapiAccountInterface>;
    updated_by?: JsonapiRelationshipInterface<JsonapiAccountInterface|null>;
    custom_attribute_values?: JsonapiRelationshipInterface<JsonapiCustomAttributeValueInterface[]>
  };
}
