import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { HelperService } from '../../core/shared/helper.service';
import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';
import { SummaryModel } from '../shared/summary.model';

@Component({
  selector: 'app-tab-summary',
  templateUrl: 'tab-summary.component.html',
  styleUrls: ['tab-summary.component.scss'],
})
export class TabSummaryComponent implements OnInit, OnDestroy {

  summary: SummaryModel;
  leadCount: string;
  proposalSentCount: string;
  viewingCount: string;
  offerReceivedCount: string;
  dealSignedCount: string;

  private loadSubscriptionIndex: number;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private helperService: HelperService,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

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

    this.loadSummary(state);
  }

  /**
   * Load summary
   */
  private loadSummary(state: DashboardState): void {

    if (this.subscriptions[this.loadSubscriptionIndex]) {

      this.subscriptions[this.loadSubscriptionIndex].unsubscribe();
    }

    this.subscriptions.push(this.dashboardApiService
      .loadSummary(state)
      .subscribe(summary => {

        this.summary = summary;
        this.leadCount = this.helperService.formatNumber(summary.leadCount);
        this.proposalSentCount = this.helperService.formatNumber(summary.proposalSentCount);
        this.viewingCount = this.helperService.formatNumber(summary.viewingCount);
        this.offerReceivedCount = this.helperService.formatNumber(summary.offerReceivedCount);
        this.dealSignedCount = this.helperService.formatNumber(summary.dealSignedCount);
      })
    );

    // Set new index
    this.loadSubscriptionIndex = this.subscriptions.length - 1;
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.load(state);
  }
}
