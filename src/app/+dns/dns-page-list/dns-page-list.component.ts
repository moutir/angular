import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { DnsPageService } from '../../core/shared/dns/dns-page.service';
import { DnsSearchlistService } from '../../core/shared/dns/dns-searchlist.service';
import { DnsModel } from '../../shared/model/dns.model';
import { DnsSearchModel } from '../../shared/model/dns-search.model';
import { DnsSearchOptionsInterface } from '../../shared/interface/dns-search-options.interface';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-dns-page-list',
  templateUrl: './dns-page-list.component.html',
})
export class DnsPageListComponent extends PageListComponentAbstract<
  DnsModel,
  DnsSearchModel,
  DnsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: DnsPageService,
    protected searchlistService: DnsSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }
}
