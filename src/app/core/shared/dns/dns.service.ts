import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { selectDataDnsRecord } from '../../../core-store/data-dns/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { DnsModel } from '../../../shared/model/dns.model';
import { DnsApiService } from '../../../api/shared/dns/dns-api.service';
import { DnsSearchModel } from '../../../shared/model/dns-search.model';

@Injectable()
export class DnsService extends ModelServiceAbstract<DnsModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected dnsApiService: DnsApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): DnsModel {

    return new DnsModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<DnsModel|null> {

    return this.store$.select(selectDataDnsRecord(id));
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: DnsSearchModel,
  ): Observable<ModelListInterface<DnsModel>> {

    return this.dnsApiService.list(pagination, sort, filters);
  }

}
