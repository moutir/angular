import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  fullName: string = '';
  dataProfile: boolean = false;
  profileImage: string = '';
  directMandates: number = 0;
  mandateListed: number = 0;
  fiveMandates: number = 0;
  exclusiveMandates: number = 0;
  buyers: number = 0;
  fiveBuyers: number = 0;
  offersReceived: number = 0;
  offersAccepted: number = 0;
  transactionTypeId: string;

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
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated dashboard state
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

    this.loadMandateSummary(state);
  }

  /**
   * Load mandate summary
   */
  private loadMandateSummary(state: DashboardState): void {

    if (this.subscriptions[this.loadSubscriptionIndex]) {

      this.subscriptions[this.loadSubscriptionIndex].unsubscribe();
    }

    this.subscriptions.push(this.dashboardApiService
      .loadMandateSummary(state)
      .subscribe(data => {

        this.dataProfile = !!data;
        this.fullName = data.full_name;
        this.profileImage = data.profile_image;
        this.directMandates = data.direct_mandates;
        this.mandateListed = data.mandate_listed;
        this.fiveMandates = data.five_mandates;
        this.exclusiveMandates = data.exclusive_mandates;
        this.buyers = data.buyers;
        this.fiveBuyers = data.five_buyers;
        this.offersReceived = data.offers_received;
        this.offersAccepted = data.offers_accepted;
      }),
    );

    // Set new index
    this.loadSubscriptionIndex = this.subscriptions.length - 1;
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.transactionTypeId = state.transactionTypeId;

    this.load(state);
  }
}
