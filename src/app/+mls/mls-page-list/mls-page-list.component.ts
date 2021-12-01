import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MlsModel } from '../../shared/model/mls.model';
import { MlsSearchOptionsInterface } from '../../shared/interface/mls-search-options.interface';
import { MlsSearchModel } from '../../shared/model/mls-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { MlsSearchlistService } from '../../core/shared/mls/mls-searchlist.service';
import { MlsPageService } from '../../core/shared/mls/mls-page.service';
import { RouterService } from '../../core/shared/router/router.service';
import { MlsService } from '../../core/shared/mls/mls.service';
import { AgencyModel } from '../../shared/model/agency.model';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

@Component({
  selector: 'app-mls-page-list',
  templateUrl: './mls-page-list.component.html',
  styleUrls: ['./mls-page-list.component.scss'],
})
export class MlsPageListComponent extends PageListComponentAbstract<
  MlsModel,
  MlsSearchModel,
  MlsSearchOptionsInterface
> {

  /**
   * Tab UIDs
   */
  tabUids: PageTabEnum[] = [
    PageTabEnum.mlsReadOverview,
    PageTabEnum.mlsReadAgencies,
  ];

  /**
   * Search query
   */
  searchQuery: string = '';

  /**
   * MLS agencies
   */
  agencies: AgencyModel[] = [];

  /**
   * Tab index
   */
  tabIndex: number;

  /**
   * Loading agencies?
   */
  isLoadingAgency: boolean = false;

  /**
   * Constructor
   */
  constructor(
    protected pageService: MlsPageService,
    protected searchlistService: MlsSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
    private mlsService: MlsService,
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
  onChangeTab(index: number): void {

    this.pageService.changeTabUid(this.tabUids[index]);
  }

  /**
   * Changed search query
   */
  onChangeQuery(query: string): void {

    this.mlsService.searchAgencies(query);
  }

  /**
   * Clicked on agency card
   */
  onClickAgency(agency: AgencyModel): void {

    this.mlsService.addAgency(agency);
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.subscriptions.push(
      combineLatest([
        this.mlsService.selectSearchQuery(),
        this.mlsService.selectAgencies(),
      ])
      .subscribe(([searchQuery, agencies]) => {

        this.isLoadingAgency = false;
        this.searchQuery = searchQuery;
        this.agencies = agencies.filter(agency => agency.name.toLowerCase().indexOf(searchQuery) > -1);
      }),
    );

    this.subscriptions.push(
      this.mlsService.selectIsLoadingAgency().subscribe(isLoading => this.isLoadingAgency = isLoading),
    );

    this.subscriptions.push(
      this.mlsService.selectSelectedAgency().subscribe(agency => this.tabIndex = !!agency ? 1 : 0),
    );
  }
}
