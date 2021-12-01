import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';
import { PropertyLocationListResponseInterface } from '../../api/shared/dashboard/property-location-list-response.interface';

@Component({
  selector: 'app-leads-portfolio',
  templateUrl: 'leads-portfolio.component.html',
  styleUrls: ['leads-portfolio.component.scss'],
})
export class LeadsPortfolioComponent implements OnInit, OnDestroy, OnChanges {

  @Input() property: any;
  @Input() budget: any;

  maxBudget: number;
  maxProperty: number;
  propertyData: any[] = null;
  propertyCategories: string[] = [];
  budgetChart: any[] = null;
  budgetCategories: string[] = [];
  budgetYAxisText: string;
  propertyLocationData: PropertyLocationListResponseInterface;
  columns: Array<any> = [{title: this.translateService.instant('label_location'), name: 'name', sort: ''},
    {title: this.translateService.instant('label_owner_report_leads'), name: 'data.leads', sort: 'desc'},
    {title: this.translateService.instant('label_portfolio'), name: 'data.portfolio', sort: ''}];
  config: any = {
    sorting: {columns: this.columns},
    className: ['table-property'],
  };

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private translateService: TranslateService,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.budgetYAxisText = this.translateService.instant('label_price_conversion');

    // Updated dashboard state
    this.subscriptions.push(
      this.dashboardStore.dashboardState$.subscribe(state => this.onNextDashboardState(state)),
    );
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.property && changes.budget) {

      this.parsePropertyData(changes.property.currentValue);
      this.parseBudgetData(changes.budget.currentValue);
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  parsePropertyData(data): void {

    if (data.length === 0) {
      this.maxProperty = 0;
      return;
    }

    const propertyMock = [{
      'name': this.translateService.instant('label_owner_report_leads'),
      'data': [],
      'color': '#eb535d',
      'borderColor': '#eb535d',
    },
      {
        'name': this.translateService.instant('label_portfolio'),
        'data': [],
        'color': '#768bff',
        'borderColor': '#768bff',
      }];

    data.map(item => {
      this.propertyCategories.push(item.name);
      propertyMock[0].data.push(item.leads_count);
      propertyMock[1].data.push(item.portfolio_count);
    });

    const maxLeads = Math.max(...propertyMock[0].data);
    const maxPortfolio = Math.max(...propertyMock[1].data);
    this.maxProperty = Math.max(maxLeads, maxPortfolio);

    this.propertyData = propertyMock;
  }

  parseBudgetData(data): void {

    if (data.length === 0) {
      this.maxBudget = 0;
      return;
    }

    const budgetMock = [{
      'name': this.translateService.instant('label_owner_report_leads'),
      'data': [],
      'color': '#eb535d',
      'borderColor': '#eb535d',
    },
      {
        'name': this.translateService.instant('label_portfolio'),
        'data': [],
        'color': '#768bff',
        'borderColor': '#768bff',
      }];

    data.map(item => {
      this.budgetCategories.push(item.name);
      budgetMock[0].data.push(item.leads_count);
      budgetMock[1].data.push(item.portfolio_count);
    });

    const maxLeads = Math.max(...budgetMock[0].data);
    const maxPortfolio = Math.max(...budgetMock[1].data);
    this.maxBudget = Math.max(maxLeads, maxPortfolio);

    this.budgetChart = budgetMock;
  }

  /**
   * Load data
   */
  private load(state: DashboardState): void {

    this.loadPropertyLocationList(state);
  }

  /**
   * Load property location list
   */
  private loadPropertyLocationList(state: DashboardState): void {

    this.dashboardApiService
      .loadPropertyLocationList(state)
      .subscribe(response => {

        this.propertyLocationData = response.sort((a, b) => b.data.leads - a.data.leads);
      });
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.load(state);
  }

  getTableData(row: object, propertyName: string): string {
    return propertyName.split('.').reduce((prev, curr) => prev[curr], row);
  }
}
