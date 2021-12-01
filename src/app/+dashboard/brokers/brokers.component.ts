import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { MultiselectSettingsInterface } from '../multiselect/multiselect-settings.interface';
import { DashboardConfig } from '../dashboard.config';
import { DashboardState } from '../shared/dashboard.state';
import { AuthenticationStore } from '../../authentication/shared/authentication.store';
import { UserModel } from '../../shared/model/user.model';
import { AppConfig } from '../../app.config';
import { ListItemModel } from './../shared/list-item.model';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  styleUrls: ['./brokers.component.scss'],
})
export class BrokersComponent implements OnInit, OnDestroy {

  colleagues: any;
  selectedColleagues: any[];
  selectedIds: string[];
  isAdmin: boolean;
  multiselectSettings: MultiselectSettingsInterface;
  userBroker: {
    id: number;
    name: string;
  };
  hideSales: boolean;
  hideRentals: boolean;

  /**
   * Dashboard state
   */
  dashboardState: DashboardState;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private appConfig: AppConfig,
    private dashboardApiService: DashboardApiService,
    private dashboardStore: DashboardStore,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardConfig: DashboardConfig,
    private authenticationStore: AuthenticationStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.isAdmin = this.dashboardConfig.isAdmin;
    this.hideSales = this.appConfig.hideSale;
    this.hideRentals = this.appConfig.hideRent;
    this.colleagues = [];
    this.selectedColleagues = [];
    this.selectedIds = [];

    // Updated dashboard state
    this.subscriptions.push(
      this.dashboardStore.dashboardState$.subscribe(state => this.onNextDashboardState(state)),
    );

    // Updated current user
    this.subscriptions.push(
      this.authenticationStore.user$.subscribe(user => this.onNextUser(user)),
    );

    // User is not admin
    if (this.isAdmin) {

      return;
    }

    // Define dropdown settings
    this.multiselectSettings = {
      singleSelection: false,
      text: 'label_select',
      multiSelectText: 'label_multiple_agents',
      enableCheckAll: true,
      selectAllText: 'label_multiselect_select_all',
      unSelectAllText: 'label_unselect_all',
      enableSearchFilter: false,
      maxHeight: 300,
    };
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Selected an item in dropdown
   */
  selectDrop(item: ListItemModel): void {

    this.selectedIds.push(String(item.id));

    const dashboardState = this.dashboardState.clone();
    dashboardState.brokerIds = this.selectedIds;

    // Update dashboard state
    this.dashboardStore.setDashboardState(dashboardState);
  }

  /**
   * Unselected an item from dropdown
   */
  unSelectDrop(item: ListItemModel): void {

    if (!(this.selectedIds.length === 1 && this.userBroker.id === item.id)) {

      this.selectedIds.splice(this.selectedIds.indexOf(String(item.id)), 1);

      if (this.selectedIds.length === 0) {

        this.selectedIds.push(String(this.userBroker.id));
      }

      const dashboardState = this.dashboardState.clone();
      dashboardState.brokerIds = this.selectedIds;

      // Update dashboard state
      this.dashboardStore.setDashboardState(dashboardState);
    }
  }

  /**
   * Select/unselect all
   */
  changeDrop(): void {

    this.selectedIds = [];
    this.selectedColleagues.forEach(item => {
      this.selectedIds.push(String(item.id));
    });

    const dashboardState = this.dashboardState.clone();
    dashboardState.brokerIds = this.selectedIds;

    // Update dashboard state
    this.dashboardStore.setDashboardState(dashboardState);
  }

  /**
   * Changed transaction type ID
   */
  onChangeTransactionTypeId(transactionTypeId: string): void {

    const isSale = transactionTypeId === this.dashboardConfig.sale.transactionTypeId;

    const dashboardState = this.dashboardState.clone();
    dashboardState.contactTypeId = isSale ? this.dashboardConfig.sale.contactTypeId : this.dashboardConfig.rent.contactTypeId;
    dashboardState.brokerTypeId = isSale ? this.dashboardConfig.sale.brokerTypeId : this.dashboardConfig.rent.brokerTypeId;
    dashboardState.transactionTypeId = transactionTypeId;

    // Update dashboard state
    this.dashboardStore.setDashboardState(dashboardState);
  }

  /**
   * Load broker list
   */
  private loadBrokerList(userId: string): void {

    this.dashboardApiService
      .loadBrokerList()
      .subscribe(data => {

        this.colleagues = data;
        this.selectedColleagues = data.filter(item => String(item.id) === userId);

        if (this.selectedColleagues.length > 0) {

          this.userBroker = this.selectedColleagues[0];
        }
      });
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.dashboardState = state;
  }

  /**
   * Next user
   */
  private onNextUser(user: UserModel): void {

    // User is not admin
    if (!this.isAdmin) {

      return;
    }

    // Load broker list
    this.loadBrokerList(user.account.contact.id);

    // Set current user as only selection
    this.selectedIds = [user.account.contact.id];
  }
}
