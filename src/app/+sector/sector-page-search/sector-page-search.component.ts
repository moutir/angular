import { Component } from '@angular/core';

import { SectorSearchModel } from '../../shared/model/sector-search.model';
import { SectorSearchOptionsInterface } from '../../shared/interface/sector-search-options.interface';
import { SectorSearchlistService } from '../../core/shared/sector/sector-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { SectorModel } from '../../shared/model/sector.model';
import { SectorPageService } from '../../core/shared/sector/sector-page.service';

@Component({
  selector: 'app-sector-page-search',
  templateUrl: './sector-page-search.component.html',
  styleUrls: ['./sector-page-search.component.scss'],
})
export class SectorPageSearchComponent extends PageSearchComponentAbstract<
  SectorModel,
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: SectorPageService,
    protected searchlistService: SectorSearchlistService,
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
