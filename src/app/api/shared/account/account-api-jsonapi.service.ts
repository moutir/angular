import { Injectable } from '@angular/core';

import { AccountGetRequestInterface } from './account-get-request.interface';
import { JsonapiAccountInterface } from '../../format/jsonapi/data/jsonapi-account.interface';
import { JsonapiSaveRequestInterface } from '../../format/jsonapi/request/jsonapi-save-request.interface';
import { AccountModel } from '../../../shared/model/account.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { JsonapiApiServiceAbstract } from '../../format/jsonapi/jsonapi-api-service.abstract';
import { JsonapiHttpService } from '../../format/jsonapi/jsonapi-http-service';

@Injectable()
export class AccountApiJsonapiService extends JsonapiApiServiceAbstract<
  AccountModel,
  AccountSearchModel,
  AccountGetRequestInterface,
  JsonapiAccountInterface
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '/api/v1/accounts';

  /**
   * Default GET request
   */
  protected defaultGetRequest: AccountGetRequestInterface = {
    fields: {
      accounts: ['contact'],
      contacts: ['first_name', 'last_name', 'emails'],
    },
    include: ['contact'],
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
  protected getLoadRequest(id: string): AccountGetRequestInterface {

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
    search: AccountSearchModel,
  ): AccountGetRequestInterface {

    // Request
    const request: AccountGetRequestInterface = {
      fields: this.defaultGetRequest.fields,
      include: this.defaultGetRequest.include,
      page: {
        offset: (pagination.page - 1) * pagination.perPage,
        limit: pagination.perPage,
      },
      filter: {},
    };

    // Filters
    if (search.isAllowSendEmailOnBehalf) {

      request.filter.allow_emails_on_behalf = '1';
    }

    return request;
  }

  /**
   * @inheritDoc
   */
  protected getSaveRequest(model: AccountModel): JsonapiSaveRequestInterface<JsonapiAccountInterface> {

    return {
      data: {
        id: model.id,
        type: 'accounts',
      },
    };
  }
}
