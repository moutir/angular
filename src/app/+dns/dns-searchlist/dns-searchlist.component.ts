import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { DnsModel } from '../../shared/model/dns.model';
import { DnsSearchModel } from '../../shared/model/dns-search.model';
import { DnsSearchOptionsInterface } from '../../shared/interface/dns-search-options.interface';
import { DnsSearchlistService } from '../../core/shared/dns/dns-searchlist.service';
import { DnsConfig } from '../../core/shared/dns/dns.config';
import { DnsService } from '../../core/shared/dns/dns.service';

@Component({
  selector: 'app-dns-searchlist',
  templateUrl: './dns-searchlist.component.html',
})
export class DnsSearchlistComponent extends SearchlistComponentAbstract<
  DnsModel,
  DnsSearchModel,
  DnsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: DnsConfig,
    protected searchlistService: DnsSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected dnsService: DnsService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

}
