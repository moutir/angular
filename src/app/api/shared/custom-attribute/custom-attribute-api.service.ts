import { Injectable } from '@angular/core';

import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { CustomAttributeSearchModel } from '../../../shared/model/custom-attribute-search.model';
import { CustomAttributeGetRequestInterface } from './custom-attribute-get-request.interface';
import { JsonapiCustomAttributeInterface } from '../../format/jsonapi/data/jsonapi-custom-attribute.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { JsonapiHttpService } from '../../format/jsonapi/jsonapi-http-service';

@Injectable()
export class CustomAttributeApiService extends JsonapiApiServiceAbstract<
  CustomAttributeModel,
  CustomAttributeSearchModel,
  CustomAttributeGetRequestInterface,
  JsonapiCustomAttributeInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/custom-attributes';

  /**
   * Default GET request
   */
  protected defaultGetRequest: CustomAttributeGetRequestInterface = {
    fields: {
      custom_attributes: [
        'title', 'created', 'updated', 'restrictions', 'agency', 'created_by', 'updated_by', 'custom_attribute_values',
      ],
      contacts: ['archived', 'reference', 'first_name', 'last_name', 'birthday', 'created', 'updated', 'agency'],
      accounts: ['contact'],
      custom_attribute_values: ['value', 'custom_attribute'],
    },
    include: ['created_by.contact', 'updated_by.contact', 'custom_attribute_values'],
  };

  /**
   * Constructor
   */
  constructor(
    protected jsonapiHttpService: JsonapiHttpService,
  ) {

    super(jsonapiHttpService);
  }

  /**
   * @inheritDoc
   */
  protected getLoadRequest(id: string): CustomAttributeGetRequestInterface {

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
    search: CustomAttributeSearchModel,
  ): CustomAttributeGetRequestInterface {

    // Request
    const request: CustomAttributeGetRequestInterface = {
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

      request.filter.title = search.name;
    }

    return request;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: CustomAttributeModel): JsonapiSaveRequestInterface<JsonapiCustomAttributeInterface> {

    const jsonapiData: JsonapiCustomAttributeInterface = {
      id: model.id,
      type: 'custom_attributes',
      attributes: {
        title: model.name,
      },
    };

    // Is adding
    if (!model.id) {

      // Set restrictions
      jsonapiData.attributes.restrictions = model.usable;
    }

    return {
      data: jsonapiData,
    };
  }
}
