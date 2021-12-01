import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { MlsModel } from '../../shared/model/mls.model';
import { MlsSearchOptionsInterface } from '../../shared/interface/mls-search-options.interface';
import { MlsSearchModel } from '../../shared/model/mls-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { MlsSearchlistService } from '../../core/shared/mls/mls-searchlist.service';
import { MlsConfig } from '../../core/shared/mls/mls.config';

@Component({
  selector: 'app-mls-searchlist',
  templateUrl: './mls-searchlist.component.html',
  styleUrls: ['./mls-searchlist.component.scss'],
})
export class MlsSearchlistComponent extends SearchlistComponentAbstract<
  MlsModel,
  MlsSearchModel,
  MlsSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MlsConfig,
    protected searchlistService: MlsSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
