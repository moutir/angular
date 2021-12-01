import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { HelperService } from '../../core/shared/helper.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';
import { RoleEnum } from '../../shared/enum/role.enum';
import { SummaryModel } from '../shared/summary.model';
import { UserModel } from '../../shared/model/user.model';
import { AuthenticationStore } from '../../authentication/shared/authentication.store';

@Component({
  selector: 'app-progress',
  templateUrl: 'progress.component.html',
  styleUrls: ['progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * Curious value that defines the "donut chart" minimum value, going from -490 (0%) to 0 (100%)
   */
  static readonly DAYS_PROGRESS_SCALE: number = -490;

  @Input() summary: SummaryModel;

  dayCount: number;
  dayProgress: number;
  roleId: RoleEnum;
  multipleBrokers: boolean = false;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private helperService: HelperService,
    private dashboardStore: DashboardStore,
    private authenticationStore: AuthenticationStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated dashboard state or current user
    this.subscriptions.push(
      combineLatest<Observable<DashboardState>, Observable<UserModel>>([
        this.dashboardStore.dashboardState$,
        this.authenticationStore.user$,
      ])
      .subscribe(values => this.onNextState(values[0], values[1])),
    );
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (!!changes.summary) {

      this.update();
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Return the progress in percentage
   */
  getProgressPercentage(): string {

    if (!this.summary.targetCount) {

      return '0%';
    }

    return (this.summary.productionCount / this.summary.targetCount * 100).toFixed() + '%';
  }

  /**
   * Return the formatted target count
   */
  getTarget(): string {

    return this.helperService.formatNumber(this.summary.targetCount);
  }

  /**
   * Return the formatted production count
   */
  getProduction(): string {

    return this.helperService.formatNumber(this.summary.productionCount);
  }

  /**
   * Update progress
   */
  private update(): void {

    const currentDate = new Date();
    const previousDate = new Date(currentDate.getFullYear(), 0, 1);
    const year = currentDate.getFullYear();
    const dayPerYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0) ? 366 : 365;

    this.dayCount = dayPerYear - Math.ceil((currentDate.getTime() - previousDate.getTime()) / 86400000);
    this.dayProgress = Math.floor((1 - this.dayCount / dayPerYear) * ProgressComponent.DAYS_PROGRESS_SCALE);
  }

  /**
   * Next state
   */
  private onNextState(state: DashboardState, user: UserModel): void {

    this.roleId = state.roleId;

    this.multipleBrokers = state.brokerIds.length > 1
      || (state.brokerIds.length === 1 && state.brokerIds.indexOf(user.account.contact.id) === -1);
  }
}
