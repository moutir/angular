import { ReplaySubject } from 'rxjs';

import { AuthenticationStore } from './authentication.store';
import { UserModel } from '../../shared/model/user.model';

describe('AuthenticationStore', () => {
  let store: AuthenticationStore;

  beforeEach(() => {

    store = new AuthenticationStore();
  });

  describe('constructor()', () => {

    it('should set default values', () => {
      store = new AuthenticationStore();

      expect(store.user$).toEqual(new ReplaySubject<UserModel>(1).asObservable());
      expect(store['user']).toEqual(new ReplaySubject<UserModel>(1));
    });
  });

  describe('setUser()', () => {

    it('should call the user subject next and set the passed values for user', (() => {
      const spy = spyOn(store['user'], 'next');
      const user = new UserModel();

      store.setUser(user);
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0]).toBe(user);
    }));
  });
});
