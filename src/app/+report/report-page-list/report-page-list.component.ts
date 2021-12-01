import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { ReportModel } from '../../shared/model/report.model';
import { ReportSearchModel } from '../../shared/model/report-search.model';
import { ReportSearchOptionsInterface } from '../../shared/interface/report-search-options.interface';
import { ReportPageService } from '../../core/shared/report/report-page.service';
import { ReportSearchlistService } from '../../core/shared/report/report-searchlist.service';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-report-page-list',
  templateUrl: './report-page-list.component.html',
  styleUrls: ['./report-page-list.component.scss'],
})
export class ReportPageListComponent extends PageListComponentAbstract<
  ReportModel,
  ReportSearchModel,
  ReportSearchOptionsInterface
> {

  /**
   * State observables
   */
  typeTabIndex$: Observable<number>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ReportPageService,
    protected searchlistService: ReportSearchlistService,
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
