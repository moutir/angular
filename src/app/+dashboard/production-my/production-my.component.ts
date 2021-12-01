import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DateFilterModel } from '../shared/date-filter.model';
import { DashboardState } from '../shared/dashboard.state';
import { RoleEnum } from '../../shared/enum/role.enum';
import { MyProductionTableResponseInterface } from '../../api/shared/dashboard/my-production-table-response.interface';
import { MyEffortTableResponseInterface } from '../../api/shared/dashboard/my-effort-table-response.interface';

@Component({
  selector: 'app-production-my',
  templateUrl: 'production-my.component.html',
  styleUrls: ['production-my.component.scss'],
})
export class ProductionMyComponent implements OnInit, OnDestroy {

  dataTable: MyProductionTableResponseInterface;
  dataEfforts: MyEffortTableResponseInterface;
  lineChartData: any;
  roleId: RoleEnum;
  isLoadingMyProductionTable: boolean;
  isLoadingMyEffortTable: boolean;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.isLoadingMyProductionTable = true;
    this.isLoadingMyEffortTable = true;

    // Updated dashboard state or date filter
    this.subscriptions.push(
      combineLatest<Observable<DashboardState>, Observable<DateFilterModel>>([
        this.dashboardStore.dashboardState$,
        this.dashboardStore.dateFilter$,
      ])
      .subscribe(values => this.onNextState(values[0], values[1])),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterLineChartData(data: any): void {

    this.lineChartData = {
      categories: [],
      series: [],
    };

    const arr = data.filter(item => {
      return item.type === 'chart';
    });

    if (arr.length > 0) {
      arr[0].data.map(item => {
        this.lineChartData.categories.push(item.name);
      });

      arr.map(item => {
        const innerData = item.data.map(obj => {
          return parseInt(obj.val.toString().replace(/[^0-9\-.]/g, ''), 10);
        });

        this.lineChartData.series.push(
          {
            'name': item.name,
            'data': innerData,
            'marker': {
              'symbol': 'circle',
            },
          },
        );
      });
    }
  }

  /**
   * Load data
   */
  private load(state: DashboardState): void {

    this.loadMyProductionTable(state);
    this.loadMyEffortTable(state);
  }

  /**
   * Load "my" production table
   */
  private loadMyProductionTable(state: DashboardState): void {

    this.isLoadingMyProductionTable = true;

    this.dashboardApiService
      .loadMyProductionTable(state)
      .subscribe(response => {

        this.dataTable = response;
        this.filterLineChartData(response);
        this.isLoadingMyProductionTable = false;
      });
  }

  /**
   * Load "my" effort table
   */
  private loadMyEffortTable(state: DashboardState): void {

    this.isLoadingMyEffortTable = true;

    this.dashboardApiService
      .loadMyEffortTable(state)
      .subscribe(response => {

        this.dataEfforts = response;
        this.isLoadingMyEffortTable = false;
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
