import { JsonapiRelationshipInterface } from '../structure/jsonapi-relationship.interface';
import { JsonapiDataInterface } from '../structure/jsonapi-data.interface';
import { JsonapiAgencyInterface } from './jsonapi-agency.interface';
import { JsonapiLocationInterface } from './jsonapi-location.interface';
import { JsonapiAccountInterface } from './jsonapi-account.interface';

export interface JsonapiSectorInterface extends JsonapiDataInterface {
  id: string;
  type: 'sectors';
  attributes?: {
    name?: string;
    geo_polygons?: Array<Array<Array<number>>>;
    created?: string;
    updated?: string|null;
  };
  relationships?: {
    agency?: JsonapiRelationshipInterface<JsonapiAgencyInterface>;
    locations?: JsonapiRelationshipInterface<JsonapiLocationInterface[]>;
    created_by?: JsonapiRelationshipInterface<JsonapiAccountInterface>;
    updated_by?: JsonapiRelationshipInterface<JsonapiAccountInterface|null>;
  };
}
