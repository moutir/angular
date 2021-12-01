import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalSearchModel } from '../../shared/model/portal-search.model';
import { PortalSearchOptionsInterface } from '../../shared/interface/portal-search-options.interface';
import { PortalConfig } from '../../core/shared/portal/portal.config';
import { PortalSearchlistService } from '../../core/shared/portal/portal-searchlist.service';
import { PortalService } from '../../core/shared/portal/portal.service';

@Component({
  selector: 'app-portal-searchlist',
  templateUrl: './portal-searchlist.component.html',
})
export class PortalSearchlistComponent extends SearchlistComponentAbstract<PortalModel,
  PortalSearchModel,
  PortalSearchOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: PortalConfig,
    protected searchlistService: PortalSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected portalService: PortalService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

}
