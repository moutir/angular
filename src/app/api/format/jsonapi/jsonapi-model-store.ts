import { KeyValueType } from '../../../shared/type/key-value.type';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { JsonapiResourceType } from './structure/jsonapi-resource.type';
import { JsonapiResourceIndexType } from './jsonapi-resource-index.type';

export class JsonapiModelStore {

  /**
   * Index of models per resource type
   */
  private model: JsonapiResourceIndexType<KeyValueType<string, ModelAbstract>> = {
    accounts: {},
    agencies: {},
    contacts: {},
    locations: {},
    properties: {},
    sectors: {},
    custom_attributes: {},
    custom_attribute_values: {},
    property_contracts: {},
    property_contract_actors: {},
    property_contract_commissions: {},
    emails: {},
  };

  /**
   * Set model instance by type and id
   */
  setModel(type: JsonapiResourceType, id: string, model: ModelAbstract): void {

    this.model[type][id] = model;
  }

  /**
   * Return model identified by type and ID
   */
  getModel<Model extends ModelAbstract>(type: JsonapiResourceType, id: string): Model|null {

    return <Model>this.model[type][id] || null;
  }
}
