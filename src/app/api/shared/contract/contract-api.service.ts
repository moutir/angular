import { Injectable } from '@angular/core';

import { ContractGetRequestInterface } from './contract-get-request.interface';
import { JsonapiContractInterface } from '../../format/jsonapi/data/jsonapi-contract.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { ContractModel } from '../../../shared/model/contract.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ContractSearchModel } from '../../../shared/model/contract-search.model';
import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { JsonapiHttpService } from '../../format/jsonapi/jsonapi-http-service';
import { HelperService } from '../../../core/shared/helper.service';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';

@Injectable()
export class ContractApiService extends JsonapiApiServiceAbstract<
  ContractModel,
  ContractSearchModel,
  ContractGetRequestInterface,
  JsonapiContractInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/property-contracts';

  /**
   * Default GET request
   */
  protected defaultGetRequest: ContractGetRequestInterface = {
    fields: {
      property_contracts: [
        'property', 'agency', 'actors', 'commissions', 'reference', 'step', 'sell_type', 'project_date', 'offer_date',
        'agreement_date', 'agreement_cooling_off_end_date', 'agreement_condition_precedent_date',
        'forecast_dead_of_sale_scheduled_date', 'forecast_dead_of_sale_contract_date',
        'forecast_dead_of_sale_collected_date', 'billing_date', 'cancellation_date', 'comment', 'price_calculation_type', 'asking_price',
        'negotiated_price_percentage', 'negotiated_price', 'deposit_amount_percentage', 'deposit_amount', 'fees_calculation_type',
        'fees', 'fees_amount', 'fees_percentage', 'vat', 'funding_personal_contribution', 'funding_condition_precedent_date',
        'funding_mortgage_amount', 'funding_accepted_date', 'created', 'updated', 'created_by', 'updated_by',
      ],
      properties: ['reference'],
      property_contract_actors: ['actor_type', 'comment', 'contact'],
      property_contract_commissions: ['commission_type', 'amount', 'comment', 'invoice_number', 'contact', 'deduct_from'],
      agencies: ['name'],
      accounts: ['contact'],
      contacts: ['first_name', 'last_name'],
    },
    include: [
      'property', 'agency', 'actors', 'commissions', 'actors.contact',
      'commissions.contact', 'created_by.contact', 'updated_by.contact',
    ],
  };

  /**
   * Constructor
   */
  constructor(
    protected jsonapiHttpService: JsonapiHttpService,
    private helperService: HelperService,
  ) {

    super(jsonapiHttpService);
  }

  /**
   * @inheritDoc
   */
  protected getLoadRequest(id: string): ContractGetRequestInterface {

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
    search: ContractSearchModel,
  ): ContractGetRequestInterface {

    // Request
    const request: ContractGetRequestInterface = {
      fields: this.defaultGetRequest.fields,
      include: this.defaultGetRequest.include,
      page: {
        offset: (pagination.page - 1) * pagination.perPage,
        limit: pagination.perPage,
      },
      filter: {},
    };

    if (search.contractReference) {

      request.filter.reference = search.contractReference;
    }

    if (search.contractStepId) {

      request.filter.step = search.contractStepId;
    }

    if (search.contactId) {

      request.filter['contacts.id'] = search.contactId;
    }

    if (search.propertyId) {

      request.filter['property.id'] = search.propertyId;
    }

    return request;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: ContractModel): JsonapiSaveRequestInterface<JsonapiContractInterface> {

    return {
      data: {
        id: model.id,
        type: 'property_contracts',
        attributes: {
          reference: model.reference,
          step: model.stepId,
          sell_type: model.sellTypeId,
          comment: model.comment,
          project_date: this.helperService.dateToString(model.projectDate, DateFormatEnum.iso) || null,
          offer_date: this.helperService.dateToString(model.offerDate, DateFormatEnum.iso) || null,
          agreement_date: this.helperService.dateToString(model.agreementDate, DateFormatEnum.iso) || null,
          agreement_cooling_off_end_date: this.helperService.dateToString(model.coolingOffEndDate, DateFormatEnum.iso) || null,
          agreement_condition_precedent_date: this.helperService.dateToString(model.conditionPrecedentDate, DateFormatEnum.iso) || null,
          forecast_dead_of_sale_scheduled_date: this.helperService.dateToString(model.scheduleDate, DateFormatEnum.iso) || null,
          forecast_dead_of_sale_contract_date: this.helperService.dateToString(model.contractDate, DateFormatEnum.iso) || null,
          forecast_dead_of_sale_collected_date: this.helperService.dateToString(model.collectionDate, DateFormatEnum.iso) || null,
          billing_date: this.helperService.dateToString(model.billingDate, DateFormatEnum.iso) || null,
          cancellation_date: this.helperService.dateToString(model.cancelDate, DateFormatEnum.iso) || null,
          price_calculation_type: model.isActivePricePercentage ? 'percentage' : 'value',
          asking_price: model.askingPrice || null,
          negotiated_price_percentage: model.negotiatedPricePercentage || null,
          negotiated_price: model.negotiatedPrice || null,
          deposit_amount_percentage: model.depositAmountPercentage || null,
          deposit_amount: model.depositAmount || null,
          fees_calculation_type: model.isActiveAgencyFeePercentage ? 'percentage' : 'value',
          fees: model.agencyFee || null,
          fees_amount: model.agencyFeeVatExcluded || null,
          fees_percentage: model.agencyFeePercentage || null,
          funding_personal_contribution: model.fundAmountPersonal || null,
          funding_condition_precedent_date: this.helperService.dateToString(model.fundConditionPrecedentDate, DateFormatEnum.iso) || null,
          funding_mortgage_amount: model.fundAmountMortgage || null,
          funding_accepted_date: this.helperService.dateToString(model.fundAcceptDate, DateFormatEnum.iso) || null,
        },
        relationships: {
          property: {
            data: {
              type: 'properties',
              id: model.property.isSharedRestricted ? '' : model.property.id,
            },
          },
        },
      },
    };
  }
}
