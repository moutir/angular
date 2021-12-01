import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SectorModel } from '../../shared/model/sector.model';
import { SectorSearchOptionsInterface } from '../../shared/interface/sector-search-options.interface';
import { SectorSearchModel } from '../../shared/model/sector-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { SectorSearchlistService } from '../../core/shared/sector/sector-searchlist.service';
import { SectorConfig } from '../../core/shared/sector/sector.config';

@Component({
  selector: 'app-sector-searchlist',
  templateUrl: './sector-searchlist.component.html',
  styleUrls: ['./sector-searchlist.component.scss'],
})
export class SectorSearchlistComponent extends SearchlistComponentAbstract<
  SectorModel,
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: SectorConfig,
    protected searchlistService: SectorSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
