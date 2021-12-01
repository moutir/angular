import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ReportingModel } from '../../shared/model/reporting.model';
import { ReportingSearchOptionsInterface } from '../../shared/interface/reporting-search-options.interface';
import { ReportingSearchlistService } from '../../core/shared/reporting/reporting-searchlist.service';
import { ReportingSearchModel } from '../../shared/model/reporting-search.model';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { ReportingPageService } from '../../core/shared/reporting/reporting-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-reporting-page-list',
  templateUrl: './reporting-page-list.component.html',
  styleUrls: ['./reporting-page-list.component.scss'],
})
export class ReportingPageListComponent extends PageListComponentAbstract<
  ReportingModel,
  ReportingSearchModel,
  ReportingSearchOptionsInterface
> implements OnInit {

  /**
   * State observables
   */
  typeTabIndex$: Observable<number>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ReportingPageService,
    protected searchlistService: ReportingSearchlistService,
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

  /**
   * Changed tab
   */
  onChangeTab(optionIndex: number, inputName: string): void {

    this.searchlistService.submitByTab(this.uid, inputName, optionIndex);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.typeTabIndex$ = this.searchlistService.selectTypeTabIndex(this.uid);
  }
}
