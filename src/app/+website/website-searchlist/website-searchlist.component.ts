import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WebsiteModel } from '../../shared/model/website.model';
import { WebsiteSearchOptionsInterface } from '../../shared/interface/website-search-options.interface';
import { WebsiteSearchModel } from '../../shared/model/website-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { WebsiteSearchlistService } from '../../core/shared/website/website-searchlist.service';
import { WebsiteConfig } from '../../core/shared/website/website.config';

@Component({
  selector: 'app-website-searchlist',
  templateUrl: './website-searchlist.component.html',
  styleUrls: ['./website-searchlist.component.scss'],
})
export class WebsiteSearchlistComponent extends SearchlistComponentAbstract<
  WebsiteModel,
  WebsiteSearchModel,
  WebsiteSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteConfig,
    protected searchlistService: WebsiteSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
