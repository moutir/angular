import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { DateFilterModel } from './date-filter.model';
import { DashboardState } from './dashboard.state';

@Injectable()
export class DashboardStore {

  /**
   * Observables
   */
  dateFilter$: Observable<DateFilterModel>;
  dashboardState$: Observable<DashboardState>;

  /**
   * Subjects
   */
  private dateFilter: ReplaySubject<DateFilterModel>;
  private dashboardState: ReplaySubject<DashboardState>;

  /**
   * Constructor
   */
  constructor() {

    // Define subjects
    this.dateFilter = new ReplaySubject<DateFilterModel>(1);
    this.dashboardState = new ReplaySubject<DashboardState>(1);

    // Define observables
    this.dateFilter$ = this.dateFilter.asObservable();
    this.dashboardState$ = this.dashboardState.asObservable();
  }

  /**
   * Set date filter
   */
  setDateFilter(dateFilter: DateFilterModel): void {

    this.dateFilter.next(dateFilter);
  }

  /**
   * Set dashboard state
   */
  setDashboardState(state: DashboardState): void {

    this.dashboardState.next(state);
  }
}
