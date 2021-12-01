import { ReplaySubject } from 'rxjs';

import { CountStore } from './count.store';
import { CountState } from './count.state';

describe('CountStore', () => {
  let store: CountStore;

  beforeEach(() => {

    store = new CountStore();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      store = new CountStore();

      expect(store['countState']).toEqual(new ReplaySubject<CountState>(1));
      expect(store.countState$).toEqual(new ReplaySubject<CountState>(1).asObservable());
    });
  });

  describe('setCountState()', () => {

    it('should call the countState subject next and set the passed values for countState', (() => {
      const spy = spyOn(store['countState'], 'next');
      const countState = new CountState();

      store.setCountState(countState);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(countState);
    }));
  });
});
