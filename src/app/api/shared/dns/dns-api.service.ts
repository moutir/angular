import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { DnsSearchModel } from '../../../shared/model/dns-search.model';
import { DnsModel } from '../../../shared/model/dns.model';
import { DnsListRequestInterface } from './dns-list-request.interface';
import { DnsListResponseInterface } from './dns-list-response.interface';

@Injectable()
export class DnsApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List DNS
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DnsSearchModel,
  ): Observable<ModelListInterface<DnsModel>> {

    return this
      .httpService
      .get<DnsListRequestInterface, DnsListResponseInterface>(
        ApiEndpointEnum.domainList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DnsSearchModel,
  ): DnsListRequestInterface {

    const request = <DnsListRequestInterface> {
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    return request;
  }

  /**
   * Handle a list() response and return a list of dns records
   */
  private listResponse(response: DnsListResponseInterface): ModelListInterface<DnsModel> {

    return {
      models: response.domains.map(data => {

        const dnsModel = new DnsModel();

        dnsModel.id = data.id;

        dnsModel.sendgridId = data.sendgridId;

        dnsModel.domain = data.domain;

        dnsModel.valid = data.valid;

        if (data.records) {

          dnsModel.records = {
            ...data.records,
          };
        }

        if (data.authDate) {

          dnsModel.authDate = this.helperService.stringToDate(data.authDate);
        }

        if (data.lastCheckDate) {

          dnsModel.lastCheckDate = this.helperService.stringToDate(data.lastCheckDate);
        }

        if (data.lastValidDate) {

          dnsModel.lastValidDate = this.helperService.stringToDate(data.lastValidDate);
        }

        return dnsModel;
      }),
      total: response.count,
    };
  }

}
