import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DashboardConfig } from './dashboard.config';
import { DashboardStore } from './shared/dashboard.store';
import { RoleEnum } from '../shared/enum/role.enum';
import { UserModel } from '../shared/model/user.model';
import { AuthenticationStore } from '../authentication/shared/authentication.store';
import { AppConfig } from '../app.config';
import { CountState } from '../layout/shared/count.state';
import { DashboardState } from './shared/dashboard.state';
import { CountStore } from '../layout/shared/count.store';
import { RuntimeFeatureInterface } from '../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../runtime/shared/runtime.service';
import { RuntimeDataEnum } from '../shared/enum/runtime-data.enum';
import { PermissionEnum } from '../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../shared/interface/runtime-authentication.interface';
import { PageHeaderInterface } from '../shared/interface/page-header.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  /**
   * Constants
   */
  readonly PERMISSION_SUGGESTION_READ: PermissionEnum = PermissionEnum.suggestionRead;

  /**
   * Page header
   */
  header: PageHeaderInterface = {
    icon: 'pie_chart',
    title: 'label_dashboard',
    subtitles: ['label_welcome'],
    buttons: [],
    buttonsLoading: [],
    buttonsDisabled: [],
    menu: {
      items: [],
    },
  };

  /**
   * Count state
   */
  countState: CountState = null;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeAuthentication$: Observable<RuntimeAuthenticationInterface>;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private appConfig: AppConfig,
    private dashboardStore: DashboardStore,
    private dashboardConfig: DashboardConfig,
    private authenticationStore: AuthenticationStore,
    private countStore: CountStore,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeAuthentication$ = this.runtimeService.selectAuthentication();

    // Updated current user
    this.subscriptions.push(
      this.authenticationStore.user$.subscribe(user => this.onNextUser(user)),
    );

    // Updated counts
    this.subscriptions.push(
      this.countStore.countState$.subscribe(counts => this.onNextCountState(counts)),
    );

    // Request permissions update
    this.runtimeService.requireData([
      RuntimeDataEnum.permissions,
      RuntimeDataEnum.feature,
      RuntimeDataEnum.optionPropertyContractStep,
    ]);
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Next user
   */
  private onNextUser(user: UserModel): void {

    const state = new DashboardState();

    state.roleId = RoleEnum.agent;
    state.brokerIds = [user.account.contact.id];
    state.contactTypeId = this.dashboardConfig.sale.contactTypeId;
    state.brokerTypeId = this.dashboardConfig.sale.brokerTypeId;
    state.transactionTypeId = this.appConfig.hideSale ?
      this.dashboardConfig.rent.transactionTypeId :
      this.dashboardConfig.sale.transactionTypeId;

    this.dashboardStore.setDashboardState(state);
  }

  /**
   * Next count state
   */
  private onNextCountState(countState: CountState): void {

    this.countState = countState;
  }
}
