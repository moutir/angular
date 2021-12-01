import { Injectable } from '@angular/core';

import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { JsonapiContractContactInterface } from '../../format/jsonapi/data/jsonapi-contract-contact.interface';
import { ContractContactModel } from '../../../shared/model/contract-contact.model';

@Injectable()
export class ContractContactApiService extends JsonapiApiServiceAbstract<
  ContractContactModel,
  null,
  null,
  JsonapiContractContactInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/property-contract-actors';

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
    search: ContractSearchModel,
  ): null {

    return null;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: ContractContactModel): JsonapiSaveRequestInterface<JsonapiContractContactInterface> {

    const request: JsonapiSaveRequestInterface<JsonapiContractContactInterface> = {
      data: {
        id: model.id,
        type: 'property_contract_actors',
        attributes: {
          actor_type: model.typeId,
          comment: model.comment,
        },
        relationships: {
          contact: {
            data: {
              id: model.contact.id,
              type: 'contacts',
            },
          },
        },
      },
    };

    // New actor
    if (!model.id) {

      request.data.relationships.property_contract = {
        data: {
          id: model.contractId,
          type: 'property_contracts',
        },
      };
    }

    return request;
  }
}
