import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { UserModel } from '../../shared/model/user.model';
import { AccountModel } from '../../shared/model/account.model';

@Injectable()
export class AuthenticationStore {

  /**
   * Observable
   */
  user$: Observable<UserModel>;
  accounts$: Observable<AccountModel[]>;
  signIn$: Observable<UserModel>;

  /**
   * Subject
   */
  private user: BehaviorSubject<UserModel>;
  private accounts: BehaviorSubject<AccountModel[]>;
  private signIn: ReplaySubject<UserModel>;

  /**
   * Constructor
   */
  constructor() {

    // Define subject
    this.user = new BehaviorSubject<UserModel>(new UserModel());
    this.accounts = new BehaviorSubject<AccountModel[]>([]);
    this.signIn = new ReplaySubject<UserModel>(1);

    // Define observable
    this.user$ = this.user.asObservable();
    this.accounts$ = this.accounts.asObservable();
    this.signIn$ = this.signIn.asObservable();
  }

  /**
   * Sets the user that signed in
   */
  setSignIn(user: UserModel): void {

    this.signIn.next(user);
  }

  /**
   * Sets the current user
   */
  setUser(user: UserModel): void {

    this.user.next(user);
  }

  /**
   * Sets the available accounts list
   */
  setAvailableUsers(accounts: AccountModel[]): void {

    this.accounts.next(accounts);
  }
}
