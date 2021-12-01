import { BehaviorSubject } from 'rxjs';

import { LayoutStore } from './layout.store';

describe('LayoutStore', () => {
  let store: LayoutStore;

  beforeEach(() => {

    store = new LayoutStore();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      store = new LayoutStore();

      expect(store['folded']).toEqual(new BehaviorSubject<boolean>(false));
      expect(store.folded$).toEqual(new BehaviorSubject<boolean>(false).asObservable());
    });
  });

  describe('setFolded()', () => {

    it('should call the folded subject next and set the passed values for folded', (() => {
      const spy = spyOn(store['folded'], 'next');

      store.setFolded(false);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(false);
    }));
  });
});
