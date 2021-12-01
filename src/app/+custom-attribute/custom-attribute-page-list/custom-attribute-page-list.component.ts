import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { CustomAttributeSearchOptionsInterface } from '../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeSearchModel } from '../../shared/model/custom-attribute-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { CustomAttributeSearchlistService } from '../../core/shared/custom-attribute/custom-attribute-searchlist.service';
import { CustomAttributePageService } from '../../core/shared/custom-attribute/custom-attribute-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-custom-attribute-page-list',
  templateUrl: './custom-attribute-page-list.component.html',
  styleUrls: ['./custom-attribute-page-list.component.scss'],
})
export class CustomAttributePageListComponent extends PageListComponentAbstract<
  CustomAttributeModel,
  CustomAttributeSearchModel,
  CustomAttributeSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: CustomAttributePageService,
    protected searchlistService: CustomAttributeSearchlistService,
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
