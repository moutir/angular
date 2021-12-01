import { Injectable } from '@angular/core';

import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { JsonapiContractCommissionInterface } from '../../format/jsonapi/data/jsonapi-contract-commission.interface';
import { ContractCommissionModel } from '../../../shared/model/contract-commission.model';

@Injectable()
export class ContractCommissionApiService extends JsonapiApiServiceAbstract<
  ContractCommissionModel,
  null,
  null,
  JsonapiContractCommissionInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/property-contract-commissions';

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
  protected getSaveRequest(model: ContractCommissionModel): JsonapiSaveRequestInterface<JsonapiContractCommissionInterface> {

    let amount = (model.amount || 0).toFixed(2);
    amount = amount.indexOf('.00') > -1 ? (amount + '01') : amount;

    const request: JsonapiSaveRequestInterface<JsonapiContractCommissionInterface> = {
      data: {
        id: model.id,
        type: 'property_contract_commissions',
        attributes: {
          commission_type: model.typeId,
          amount: parseFloat(amount),
          invoice_number: model.invoice,
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

    // New commission
    if (!model.id) {

      // Contract
      request.data.relationships.property_contract = {
        data: {
          id: model.contractId,
          type: 'property_contracts',
        },
      };

      // Deduction
      if (model.parentContractCommissionId) {

        request.data.relationships.deduct_from = {
          data: {
            id: model.parentContractCommissionId,
            type: 'property_contract_commissions',
          },
        };
      }
    }

    return request;
  }
}
