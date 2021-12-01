import { Component } from '@angular/core';

import { RestrictionSearchModel } from '../../shared/model/restriction-search.model';
import { RestrictionSearchOptionsInterface } from '../../shared/interface/restriction-search-options.interface';
import { RestrictionSearchlistService } from '../../core/shared/restriction/restriction-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { RestrictionModel } from '../../shared/model/restriction.model';
import { RestrictionPageService } from '../../core/shared/restriction/restriction-page.service';

@Component({
  selector: 'app-restriction-page-search',
  templateUrl: './restriction-page-search.component.html',
  styleUrls: ['./restriction-page-search.component.scss'],
})
export class RestrictionPageSearchComponent extends PageSearchComponentAbstract<
  RestrictionModel,
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: RestrictionPageService,
    protected searchlistService: RestrictionSearchlistService,
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
