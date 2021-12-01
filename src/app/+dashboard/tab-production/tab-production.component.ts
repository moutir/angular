import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { DashboardConfig } from '../dashboard.config';
import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DateFilterModel } from '../shared/date-filter.model';
import { DashboardState } from '../shared/dashboard.state';
import { RoleEnum } from '../../shared/enum/role.enum';
import { ProductionType } from '../shared/production.type';
import { PeriodSelectorType } from '../shared/period-selector.type';
import { PeriodType } from '../shared/period.type';

@Component({
  selector: 'app-tab-production',
  templateUrl: 'tab-production.component.html',
  styleUrls: ['tab-production.component.scss'],
})
export class TabProductionComponent implements OnInit, OnDestroy {

  /**
   * Currently selected year
   */
  year: string;

  /**
   * Years list
   */
  years: Array<{ id: number; name: string; }>; // TODO[later]: define interface

  /**
   * Currently selected period
   */
  periodType: PeriodType;

  /**
   * Currently applied period selector
   */
  periodSelectorType: PeriodSelectorType;

  /**
   * Active production
   */
  productionType: ProductionType;

  /**
   * Is the user admin ? TODO[later] wrap this in an ACL service "aclService.canReadTransaction()"
   */
  isAdmin: boolean;

  /**
   * Number of selected brokers
   */
  brokerCount: number;

  /**
   * User current role ID
   */
  roleId: RoleEnum;

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
    private dashboardConfig: DashboardConfig,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    const currentYear = new Date().getFullYear();

    // Default values
    this.year = currentYear.toString();
    this.periodType = 'yearly';
    this.periodSelectorType = 'none';
    this.years = [];
    this.brokerCount = 0;
    this.isAdmin = this.dashboardConfig.isAdmin;

    let year = this.dashboardConfig.yearStart;

    while (year <= currentYear) {

      this.years.push({
        id: year,
        name: year.toString(),
      });

      year++;
    }

    // Default production type
    this.setProductionType('my');

    // Date filter
    this.loadDateFilter();

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

  /**
   * Selected a year
   */
  onSelectYear(event: MatSelectChange): void {

    this.year = event.value;

    this.updateDateFilter(true);
  }

  /**
   * Clicked a period
   */
  onClickPeriodType(periodType: PeriodType): void {

    this.periodType = periodType;

    this.updateDateFilter(true);
  }

  /**
   * Clicked on a production button
   */
  onClickProductionType(productionType: ProductionType): void {

    this.setProductionType(productionType);
  }

  /**
   * Set the production type
   */
  private setProductionType(productionType: ProductionType): void {

    this.productionType = productionType;

    this.periodSelectorType = productionType === 'my' ? 'all' : 'year';
  }

  /**
   * Store date filter
   */
  private updateDateFilter(updateRemote: boolean): void {

    const dateFilter = new DateFilterModel();
    dateFilter.year = this.year;
    dateFilter.month = this.periodType === 'monthly';

    // Update remote then update store
    if (updateRemote === true) {

      this
        .dashboardApiService
        .storeDateFilter(dateFilter)
        .subscribe(() => this.dashboardStore.setDateFilter(dateFilter));

      return;
    }

    // Default case update only store
    this.dashboardStore.setDateFilter(dateFilter);
  }

  /**
   * Load date filter
   */
  private loadDateFilter(): void {

    this.dashboardApiService
      .loadDateFilter()
      .subscribe(data => {

        this.year = data.filter_date ? data.filter_date.toString() : this.year;
        this.periodType = data.filter_month && JSON.parse(data.filter_month) ? 'monthly' : this.periodType;

        this.updateDateFilter(false);
      });
  }

  /**
   * Next state
   */
  private onNextState(state: DashboardState, dateFilter: DateFilterModel): void {

    this.year = dateFilter.year;
    this.roleId = state.roleId;
    this.brokerCount = state.brokerIds.length;

    if (this.brokerCount === 1 && this.productionType === 'agent') {

      this.setProductionType('my');
    }
  }
}
