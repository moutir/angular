import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DateFilterModel } from '../shared/date-filter.model';
import { DashboardState } from '../shared/dashboard.state';
import { RoleEnum } from '../../shared/enum/role.enum';
import { AgentProductionTableResponseInterface } from '../../api/shared/dashboard/agent-production-table-response.interface';
import { AgentEffortTableResponseInterface } from '../../api/shared/dashboard/agent-effort-table-response.interface';

@Component({
  selector: 'app-production-agent',
  templateUrl: 'production-agent.component.html',
  styleUrls: ['production-agent.component.scss'],
})
export class ProductionAgentComponent implements OnInit, OnDestroy {

  agentEffortTable: AgentEffortTableResponseInterface;
  agentProductionTable: AgentProductionTableResponseInterface;
  dropdownData: any[] = [];
  doughnutDataProd: any[];
  doughnutDataProdAmount = 0;
  barCategoryProd: string[] = [];
  barDataProd: any[] = [{
    name: 'Leads',
    data: [],
    color: '#768bff',
    borderColor: '#768bff',
  }];
  doughnutDataDirect: any[];
  doughnutDataDirectAmount = 0;
  barCategoryDirect: string[] = [];
  barDataDirect: any[] = [{
    name: 'Leads',
    data: [],
    color: '#768bff',
    borderColor: '#768bff',
  }];

  colors: string[] = [
    '#768bff',
    '#86ce5e',
    '#e654c5',
    '#5e6fd3',
    '#f89054',
  ];

  selectedDirectVal = 'piechart';
  selectedProdVal = 'piechart';
  seriesNameProd: string;
  seriesNameDirectMargin: string;
  labelAgents: string;

  roleId: RoleEnum;
  isLoadingAgentProductionTable: boolean;
  isLoadingAgentEffortTable: boolean;
  isLoadingAgentProductionChart: boolean;
  isLoadingAgentDirectMarginChart: boolean;

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

    // Default values
    this.isLoadingAgentProductionTable = true;
    this.isLoadingAgentEffortTable = true;
    this.isLoadingAgentProductionChart = true;
    this.isLoadingAgentDirectMarginChart = true;

    this.seriesNameProd = this.translateService.instant('label_production');
    this.seriesNameDirectMargin = this.translateService.instant('label_direct_margin_per_agent');
    this.labelAgents = this.translateService.instant('label_agents');

    this.dropdownData = [
      {id: 'piechart', name: this.translateService.instant('label_piechart')},
      {id: 'chart', name: this.translateService.instant('label_chart')},
    ];

    // Get current date filter
    this.dashboardStore
      .dateFilter$
      .pipe(
        first(),
      )
      .subscribe(dateFilter => {

        // Force yearly period
        const dateFilterUpdated = dateFilter.clone();
        dateFilterUpdated.month = false;

        // Store remote date filter
        this.dashboardApiService
          .storeDateFilter(dateFilter)
          .subscribe(() => {

            // Update date filter
            this.dashboardStore.setDateFilter(dateFilterUpdated);

            // Updated dashboard state or date filter
            this.subscriptions.push(
              combineLatest<Observable<DashboardState>, Observable<DateFilterModel>>([
                this.dashboardStore.dashboardState$,
                this.dashboardStore.dateFilter$,
              ])
              .subscribe(values => this.onNextState(values[0], values[1])),
            );
          });
      });
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Load data tables and charts
   */
  private load(state: DashboardState): void {

    this.loadAgentProductionTable(state);
    this.loadAgentEffortTable(state);
    this.loadAgentProductionChart(state);
    this.loadAgentDirectMarginChart(state);
  }

  /**
   * Load agent production chart
   */
  private loadAgentProductionChart(state: DashboardState): void {

    this.isLoadingAgentProductionChart = true;

    this.dashboardApiService
      .loadAgentProductionChart(state)
      .subscribe(data => {

        this.isLoadingAgentProductionChart = false;
        this.barDataProd[0].data = [];
        this.barCategoryProd = [];
        this.doughnutDataProd = [];
        this.doughnutDataProdAmount = 0;

        if (data.length === 0) {

          this.doughnutDataProd = null;
          return;
        }

        data.forEach((item, i) => {
          this.barDataProd[0].data.push(+item.count);
          this.barCategoryProd.push(item.broker_name);

          this.doughnutDataProdAmount += (+item.count);
          this.doughnutDataProd.push({
            name: item.broker_name,
            stars: item.broker_name,
            y: (+item.count),
            color: this.colors[i],
          });
        });
      });
  }

  /**
   * Load agent direct margin chart
   */
  private loadAgentDirectMarginChart(state: DashboardState): void {

    this.isLoadingAgentDirectMarginChart = true;

    this.dashboardApiService
      .loadAgentDirectMarginChart(state)
      .subscribe(data => {

        this.isLoadingAgentDirectMarginChart = false;
        this.doughnutDataDirect = [];
        this.barDataDirect[0].data = [];
        this.doughnutDataDirectAmount = 0;
        this.barCategoryDirect = [];

        if (data.length === 0) {

          this.doughnutDataDirect = null;
          return;
        }

        data.forEach((item, i) => {
          this.barDataDirect[0].data.push(+item.count);
          this.barCategoryDirect.push(item.broker_name);

          this.doughnutDataDirectAmount += (+item.count);
          this.doughnutDataDirect.push({
            name: item.broker_name,
            stars: item.broker_name,
            y: (+item.count),
            color: this.colors[i],
          });
        });
      });
  }

  /**
   * Load agent production table
   */
  private loadAgentProductionTable(state: DashboardState): void {

    this.isLoadingAgentProductionTable = true;

    this.dashboardApiService
      .loadAgentProductionTable(state)
      .subscribe(response => {

        this.agentProductionTable = response;
        this.isLoadingAgentProductionTable = false;
      });
  }

  /**
   * Load agent effort table
   */
  private loadAgentEffortTable(state: DashboardState): void {

    this.isLoadingAgentEffortTable = true;

    this.dashboardApiService
      .loadAgentEffortTable(state)
      .subscribe(response => {

        this.agentEffortTable = response;
        this.isLoadingAgentEffortTable = false;
      });
  }

  /**
   * Next state
   */
  private onNextState(state: DashboardState, dateFilter: DateFilterModel): void {

    this.roleId = state.roleId;

    this.load(state);
  }
}
