import { Injectable } from '@angular/core';

import { ModelAbstract } from '../../../shared/class/model.abstract';
import { JsonapiGetOneResponseInterface } from './response/jsonapi-get-one-response.interface';
import { JsonapiGetManyResponseInterface } from './response/jsonapi-get-many-response.interface';
import { JsonapiSectorHydrator } from './data/jsonapi-sector.hydrator';
import { JsonapiDataInterface } from './structure/jsonapi-data.interface';
import { JsonapiResourceIndexType } from './jsonapi-resource-index.type';
import { JsonapiContactHydrator } from './data/jsonapi-contact.hydrator';
import { JsonapiLocationHydrator } from './data/jsonapi-location.hydrator';
import { JsonapiAccountHydrator } from './data/jsonapi-account.hydrator';
import { JsonapiAgencyHydrator } from './data/jsonapi-agency.hydrator';
import { JsonapiHydratorInterface } from './jsonapi-hydrator.interface';
import { JsonapiModelStore } from './jsonapi-model-store';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { JsonapiSaveResponseInterface } from './response/jsonapi-save-response.interface';
import { JsonapiCustomAttributeHydrator } from './data/jsonapi-custom-attribute.hydrator';
import { JsonapiCustomAttributeValueHydrator } from './data/jsonapi-custom-attribute-value.hydrator';
import { JsonapiContractHydrator } from './data/jsonapi-contract.hydrator';
import { JsonapiPropertyHydrator } from './data/jsonapi-property.hydrator';
import { JsonapiContractContactHydrator } from './data/jsonapi-contract-contact.hydrator';
import { JsonapiContractCommissionHydrator } from './data/jsonapi-contract-commission.hydrator';
import { JsonapiContactEmailHydrator } from './data/jsonapi-contact-email.hydrator';

@Injectable()
export class JsonapiParserService {

  /**
   * Index of hydrators and models per resource type
   */
  private hydrator: JsonapiResourceIndexType<JsonapiHydratorInterface<JsonapiDataInterface, ModelAbstract>> = {
    accounts: new JsonapiAccountHydrator(),
    agencies: new JsonapiAgencyHydrator(),
    contacts: new JsonapiContactHydrator(),
    locations: new JsonapiLocationHydrator(),
    properties: new JsonapiPropertyHydrator(),
    sectors: new JsonapiSectorHydrator(),
    custom_attributes: new JsonapiCustomAttributeHydrator(),
    custom_attribute_values: new JsonapiCustomAttributeValueHydrator(),
    property_contracts: new JsonapiContractHydrator(),
    property_contract_actors: new JsonapiContractContactHydrator(),
    property_contract_commissions: new JsonapiContractCommissionHydrator(),
    emails: new JsonapiContactEmailHydrator(),
  };

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Parse a JSONAPI "get one" response and returns a model instance
   */
  parseGetOne<Data extends JsonapiDataInterface, Model extends ModelAbstract>(response: JsonapiGetOneResponseInterface<Data>): Model {

    // Parse records into a store of models
    const modelStore = this.parseGet([response.data], response.included || []);

    // Return model
    return modelStore.getModel<Model>(response.data.type, response.data.id);
  }

  /**
   * Parse a JSONAPI "get many" response and returns an array of model instances
   */
  parseGetMany<Data extends JsonapiDataInterface, Model extends ModelAbstract>(
    response: JsonapiGetManyResponseInterface<Data>,
  ): {
    models: Model[];
    total: number;
  } {

    // Parse records into a store of models
    const modelStore = this.parseGet(response.data, response.included || []);

    // Parse models
    const models = <Model[]>response.data
      .filter(record => modelStore.getModel<Model>(record.type, record.id) !== null)
      .map(record => modelStore.getModel<Model>(record.type, record.id));

    return {
      models: models,
      total: response.meta.total_count,
    };
  }

  /**
   * Parse JSONAPI save to a model save interface, replacing '{i}' in @errorMapping by @index if not null
   */
  parseSave<Model extends ModelAbstract>(
    response: JsonapiSaveResponseInterface,
    errorMapping: KeyValueType<string, string>,
    index: number|null = null,
  ): ModelSaveInterface {

    const modelSave: ModelSaveInterface = {
      modelError: {},
      generalError: [],
    };

    // No errors
    if (!response.errors || response.errors.length === 0) {

      return modelSave;
    }

    response.errors.forEach(error => {

      // Unsupported error format
      if (!error.title) {

        console.error('Unsupported error format', error);

        return;
      }

      if (!error.source || !error.source.pointer) {

        console.error('Missing [error.source.pointer], unable to map error to an input!', error);

        modelSave.generalError.push({
          code: 'Missing [error.source.pointer]',
          message: error.title,
        });

        return;
      }

      // No mapping for this error
      if (!errorMapping[error.source.pointer]) {

        console.error('Error mapping [' + error.source.pointer + '] is not mapped in module config, unable to render error message!');

        modelSave.generalError.push({
          code: error.source.pointer,
          message: error.title,
        });

        return;
      }

      // Map error to model attribute
      const errorAttribute = errorMapping[error.source.pointer].replace('{i}', String(index));
      modelSave.modelError[errorAttribute] = error.title;
    });

    return modelSave;
  }

  /**
   * Returns a JSONAPI model store
   */
  private parseGet(data: JsonapiDataInterface[], included: JsonapiDataInterface[]): JsonapiModelStore {

    // Instantiate new model store
    const modelStore = new JsonapiModelStore();

    const records: JsonapiDataInterface[] = data.concat(included);
    const hashQueue: string[] = [];
    const recordMap: KeyValueType<string, JsonapiDataInterface> = {};

    // For each record
    records.forEach(record => {

      // Invalid type
      if (!this.hydrator[record.type]) {

        console.error('Unsupported JSONAPI resource type [', record.type, '].');

        return;
      }

      // Store record's hash
      const recordHash = record.type + '|' + record.id;
      recordMap[recordHash] = record;

      // New ID
      if (modelStore.getModel(record.type, record.id) === null) {

        // Instantiate model
        const model = this.hydrator[record.type].factory();
        model.id = record.id;
        modelStore.setModel(record.type, record.id, model);
      }

      // Hash not in queue yet
      if (hashQueue.indexOf(recordHash) === -1) {

        // Add record to queue
        record.relationships ? hashQueue.push(recordHash) : hashQueue.unshift(recordHash);
      }

      // Record has relationships
      if (record.relationships) {

        const index = hashQueue.indexOf(recordHash);

        // For each relationship
        Object
          .keys(record.relationships)
          .forEach(key => {

            // No data
            if (record.relationships[key] === null || record.relationships[key].data === null) {

              return;
            }

            // Make an array of data
            const relationDataArray = <JsonapiDataInterface[]>(
              Array.isArray(record.relationships[key].data) ? record.relationships[key].data : [record.relationships[key].data]
            );

            relationDataArray.forEach(relationData => {

              const dataHash = relationData.type + '|' + relationData.id;

              // Hash not in queue yet
              if (hashQueue.indexOf(dataHash) === -1) {

                // Add data hash before record hash
                hashQueue.splice(index, 0, dataHash);
              }
            });
          });
      }
    });

    // For each hash in queue
    hashQueue.forEach(hash => {

      // Get record
      const record = recordMap[hash];

      // No record (from a relationship without any "included" attributes for example
      if (!record) {

        return;
      }

      // Hydrate model
      this.hydrator[record.type].hydrate(modelStore.getModel(record.type, record.id), recordMap[hash], modelStore);
    });

    return modelStore;
  }
}
