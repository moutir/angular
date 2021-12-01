import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RestrictionModel } from '../../shared/model/restriction.model';
import { RestrictionSearchOptionsInterface } from '../../shared/interface/restriction-search-options.interface';
import { RestrictionSearchModel } from '../../shared/model/restriction-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { RestrictionSearchlistService } from '../../core/shared/restriction/restriction-searchlist.service';
import { RestrictionConfig } from '../../core/shared/restriction/restriction.config';

@Component({
  selector: 'app-restriction-searchlist',
  templateUrl: './restriction-searchlist.component.html',
  styleUrls: ['./restriction-searchlist.component.scss'],
})
export class RestrictionSearchlistComponent extends SearchlistComponentAbstract<
  RestrictionModel,
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: RestrictionConfig,
    protected searchlistService: RestrictionSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
