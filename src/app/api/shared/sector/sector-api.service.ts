import { Injectable } from '@angular/core';

import { SectorGetRequestInterface } from './sector-get-request.interface';
import { JsonapiSectorInterface } from '../../format/jsonapi/data/jsonapi-sector.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { SectorModel } from '../../../shared/model/sector.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { SectorSearchModel } from '../../../shared/model/sector-search.model';
import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { JsonapiHttpService } from '../../format/jsonapi/jsonapi-http-service';

@Injectable()
export class SectorApiService extends JsonapiApiServiceAbstract<
  SectorModel,
  SectorSearchModel,
  SectorGetRequestInterface,
  JsonapiSectorInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/sectors';

  /**
   * Default GET request
   */
  protected defaultGetRequest: SectorGetRequestInterface = {
    fields: {
      sectors: ['name', 'agency', 'locations', 'created', 'updated', 'created_by', 'updated_by'],
      locations: ['label'],
      contacts: ['archived', 'reference', 'first_name', 'last_name', 'birthday', 'created', 'updated', 'agency'],
      accounts: ['contact'],
    },
    include: ['locations', 'created_by.contact', 'updated_by.contact'],
  };

  /**
   * Constructor
   */
  constructor(
    protected jsonapiHttpService: JsonapiHttpService,
    protected runtimeService: RuntimeService,
  ) {

    super(jsonapiHttpService);

    // Polygons feature is active
    runtimeService
      .selectFeature()
      .subscribe(feature => {

        // Feature inactive or polygons already added
        if (feature.polygons !== true || this.defaultGetRequest.fields.sectors.indexOf('geo_polygons') > -1) {

          return;
        }

        this.defaultGetRequest.fields.sectors.push('geo_polygons');
      });
  }

  /**
   * @inheritDoc
   */
  protected getLoadRequest(id: string): SectorGetRequestInterface {

    return {
      fields: this.defaultGetRequest.fields,
      include: this.defaultGetRequest.include,
    };
  }

  /**
   * @inheritDoc
   */
  protected getListRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: SectorSearchModel,
  ): SectorGetRequestInterface {

    // Request
    const request: SectorGetRequestInterface = {
      fields: this.defaultGetRequest.fields,
      include: this.defaultGetRequest.include,
      page: {
        offset: (pagination.page - 1) * pagination.perPage,
        limit: pagination.perPage,
      },
      filter: {},
    };

    // Filters
    if (search.name) {

      request.filter.name = search.name;
    }

    return request;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: SectorModel): JsonapiSaveRequestInterface<JsonapiSectorInterface> {

    const jsonapiData: JsonapiSectorInterface = {
      id: model.id,
      type: 'sectors',
      attributes: {
        name: model.name,
      },
      relationships: {
        locations: {
          data: model.locations.map(location => {

            return {
              type: 'locations',
              id: location.id,
            };
          }),
        },
      },
    };

    // Polygons activated
    if (this.defaultGetRequest.fields.sectors.indexOf('geo_polygons') > -1) {

      jsonapiData.attributes.geo_polygons = model.polygons
        .filter(polygon => !!polygon)
        .map(polygon => {

          const vertices = polygon.vertices.map(vertex => {

            return [
              vertex.lng,
              vertex.lat,
            ];
          });

          // Add first vertex as last (BE requirement)
          vertices.push(vertices[0]);

          return vertices;
        });
    }

    return {
      data: jsonapiData,
    };
  }
}
