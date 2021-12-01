import { ReplaySubject } from 'rxjs';

import { DashboardStore } from './dashboard.store';
import { DashboardState } from './dashboard.state';
import { DateFilterModel } from './date-filter.model';

describe('DashboardStore', () => {
  let store: DashboardStore;

  beforeEach(() => {

    store = new DashboardStore();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      store = new DashboardStore();

      expect(store['dashboardState']).toEqual(new ReplaySubject<DashboardState>(1));
      expect(store['dateFilter']).toEqual(new ReplaySubject<DateFilterModel>(1));
      expect(store.dashboardState$).toEqual(new ReplaySubject<DashboardState>(1).asObservable());
      expect(store.dateFilter$).toEqual(new ReplaySubject<DateFilterModel>(1).asObservable());
    });
  });

  describe('setDateFilter()', () => {

    it('should call the date filter subject next and set the passed values for date filter', (() => {
      const spy = spyOn(store['dateFilter'], 'next');
      const dateFilter = new DateFilterModel();

      store.setDateFilter(dateFilter);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(dateFilter);
    }));
  });

  describe('setDashboardState()', () => {

    it('should call the dashboard state subject next and set the passed values for dashboard state', (() => {
      const spy = spyOn(store['dashboardState'], 'next');
      const dashboardState = new DashboardState();

      store.setDashboardState(dashboardState);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(dashboardState);
    }));
  });
});
