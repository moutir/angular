import { Injectable } from '@angular/core';

import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { CustomAttributeSearchModel } from '../../../shared/model/custom-attribute-search.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { JsonapiCustomAttributeValueInterface } from '../../format/jsonapi/data/jsonapi-custom-attribute-value.interface';
import { CustomAttributeValueModel } from '../../../shared/model/custom-attribute-value.model';

@Injectable()
export class CustomAttributeValueApiService extends JsonapiApiServiceAbstract<
  CustomAttributeValueModel,
  null,
  null,
  JsonapiCustomAttributeValueInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/custom-attribute-values';

  /**
   * @inheritDoc
   */
  protected getLoadRequest(id: string): null {

    return null;
  }

  /**
   * @inheritDoc
   */
  protected getListRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: CustomAttributeSearchModel,
  ): null {

    return null;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: CustomAttributeValueModel): JsonapiSaveRequestInterface<JsonapiCustomAttributeValueInterface> {

    return {
      data: {
        id: model.id,
        type: 'custom_attribute_values',
        attributes: {
          value: model.label,
        },
        relationships: {
          custom_attribute: {
            data: {
              id: model.customAttributeId,
              type: 'custom_attributes',
            },
          },
        },
      },
    };
  }
}
