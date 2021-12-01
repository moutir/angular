import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProcessModel } from '../../shared/model/process.model';
import { ProcessSearchOptionsInterface } from '../../shared/interface/process-search-options.interface';
import { ProcessSearchModel } from '../../shared/model/process-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { ProcessSearchlistService } from '../../core/shared/process/process-searchlist.service';
import { ProcessPageService } from '../../core/shared/process/process-page.service';
import { RouterService } from '../../core/shared/router/router.service';
import { Observable } from 'rxjs';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-process-page-list',
  templateUrl: './process-page-list.component.html',
  styleUrls: ['./process-page-list.component.scss'],
})
export class ProcessPageListComponent extends PageListComponentAbstract<
  ProcessModel,
  ProcessSearchModel,
  ProcessSearchOptionsInterface
> {

  /**
   * State observables
   */
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ProcessPageService,
    protected searchlistService: ProcessSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
    protected runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();
  }
}
