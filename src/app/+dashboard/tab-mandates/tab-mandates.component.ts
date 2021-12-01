import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';
import { PropertyChartResponseInterface } from '../../api/shared/dashboard/property-chart-response.interface';
import { BuyerChartResponseInterface } from '../../api/shared/dashboard/buyer-chart-response.interface';
import { PropertyTypeChartResponseInterface } from '../../api/shared/dashboard/property-type-chart-response.interface';
import { BudgetChartResponseInterface } from '../../api/shared/dashboard/budget-chart-response.interface';

@Component({
  selector: 'app-tab-mandates',
  templateUrl: 'tab-mandates.component.html',
  styleUrls: ['tab-mandates.component.scss'],
})
export class MandatesTabComponent implements OnInit, OnDestroy {

  propertyChart: PropertyChartResponseInterface;
  buyerChart: BuyerChartResponseInterface;
  propertyTypeChart: PropertyTypeChartResponseInterface;
  budgetChart: BudgetChartResponseInterface;
  isLoadingPropertyChart: boolean;
  isLoadingBuyerChart: boolean;
  isLoadingPropertyTypeChart: boolean;
  isLoadingBudgetChart: boolean;
  transactionTypeId: string;

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
    this.isLoadingPropertyChart = true;
    this.isLoadingBuyerChart = true;
    this.isLoadingPropertyTypeChart = true;
    this.isLoadingBudgetChart = true;

    // Updated dashboard state or date filter
    this.subscriptions.push(
      this.dashboardStore.dashboardState$.subscribe(state => this.onNextDashboardState(state)),
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
   * Load data
   */
  private load(state: DashboardState): void {

    this.loadPropertyChart(state);
    this.loadBuyerChart(state);
    this.loadPropertyTypeChart(state);
    this.loadBudgetChart(state);
  }

  /**
   * Load property chart
   */
  private loadPropertyChart(state: DashboardState): void {

    this.isLoadingPropertyChart = true;

    this.dashboardApiService
      .loadPropertyChart(state)
      .subscribe(response => {

        this.propertyChart = response;
        this.isLoadingPropertyChart = false;
      });
  }

  /**
   * Load buyer chart
   */
  private loadBuyerChart(state: DashboardState): void {

    this.isLoadingBuyerChart = true;

    this.dashboardApiService
      .loadBuyerChart(state)
      .subscribe(response => {

        this.buyerChart = response;
        this.isLoadingBuyerChart = false;
      });
  }

  /**
   * Load property type chart
   */
  private loadPropertyTypeChart(state: DashboardState): void {

    this.isLoadingPropertyTypeChart = true;

    this.dashboardApiService
      .loadPropertyTypeChart(state)
      .subscribe(response => {

        this.propertyTypeChart = response;
        this.isLoadingPropertyTypeChart = false;
      });
  }

  /**
   * Load budget chart
   */
  private loadBudgetChart(state: DashboardState): void {

    this.isLoadingBudgetChart = true;

    this.dashboardApiService
      .loadBudgetChart(state)
      .subscribe(response => {

        this.budgetChart = response;
        this.isLoadingBudgetChart = false;
      });
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.transactionTypeId = state.transactionTypeId;

    this.load(state);
  }
}
