import { Component } from '@angular/core';

import { CustomAttributeSearchModel } from '../../shared/model/custom-attribute-search.model';
import { CustomAttributeSearchOptionsInterface } from '../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeSearchlistService } from '../../core/shared/custom-attribute/custom-attribute-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { CustomAttributePageService } from '../../core/shared/custom-attribute/custom-attribute-page.service';

@Component({
  selector: 'app-custom-attribute-page-search',
  templateUrl: './custom-attribute-page-search.component.html',
  styleUrls: ['./custom-attribute-page-search.component.scss'],
})
export class CustomAttributePageSearchComponent extends PageSearchComponentAbstract<
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
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
