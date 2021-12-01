import { SectorModel } from '../../../../shared/model/sector.model';
import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiSectorInterface } from './jsonapi-sector.interface';
import { JsonapiModelStore } from '../jsonapi-model-store';
import { LocationModel } from '../../../../shared/model/location.model';
import { GeolocPolygonInterface } from '../../../../shared/interface/geoloc-polygon.interface';
import { AccountModel } from '../../../../shared/model/account.model';

export class JsonapiSectorHydrator implements JsonapiHydratorInterface<JsonapiSectorInterface, SectorModel> {

  /**
   * @inheritDoc
   */
  factory(): SectorModel {

    return new SectorModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: SectorModel,
    data: JsonapiSectorInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Has attributes
    if (data.attributes) {

      model.name = data.attributes.name || model.name;
      model.createDate = data.attributes.created ? new Date(data.attributes.created) : model.createDate;
      model.updateDate = data.attributes.updated ? new Date(data.attributes.updated) : model.updateDate;

      if (data.attributes.geo_polygons) {

        model.polygons = data.attributes.geo_polygons.map((vertices, i) => {

          const polygon: GeolocPolygonInterface = {
            id: [model.id, i].join('-'),
            color: '',
            vertices: [],
          };

          vertices.forEach(vertex => {

            polygon.vertices.push({
              lat: vertex[1],
              lng: vertex[0],
            });
          });

          return polygon;
        });
      }
    }

    // Has no relationships
    if (!data.relationships) {

      return;
    }

    // Relationships
    Object
      .keys(data.relationships)
      .filter(relationship => data.relationships[relationship] !== null && data.relationships[relationship].data !== null)
      .forEach(relationship => {

        // Has relationship locations
        if (relationship === 'locations') {

          model.locations = data.relationships.locations.data
            .map(relationshipData => modelStore.getModel<LocationModel>('locations', relationshipData.id))
            .filter(location => location !== null);
        }

        // Has relationship created_by
        if (relationship === 'created_by') {

          const userCreate = modelStore.getModel<AccountModel>('accounts', data.relationships.created_by.data.id);

          model.createContact = userCreate.contact;
        }

        // Has relationship updated_by
        if (relationship === 'updated_by') {

          const userUpdate = modelStore.getModel<AccountModel>('accounts', data.relationships.updated_by.data.id);

          model.updateContact = userUpdate.contact;
        }
      });
  }
}
