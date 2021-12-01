import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { UserModel } from '../../shared/model/user.model';
import { AuthenticationStore } from '../shared/authentication.store';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { SessionStorageService } from '../../core/shared/storage/session-storage.service';
import { SessionStorageEnum } from '../../shared/enum/session-storage.enum';
import { LocalStorageEnum } from '../../shared/enum/local-storage.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { LocalStorageService } from '../../core/shared/storage/local-storage.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { AuthenticationService } from '../../core/shared/authentication/authentication.service';
import { AccountModel } from '../../shared/model/account.model';

@Component({
  selector: 'app-user-switch',
  templateUrl: './user-switch.component.html',
  styleUrls: ['./user-switch.component.scss'],
})
export class UserSwitchComponent implements OnInit, OnDestroy {

  /**
   * Current user
   */
  user: UserModel;

  /**
   * List of accounts to switch
   */
  accounts: AccountModel[];

  /**
   * Is menu active
   */
  isMenuActive: boolean = false;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Is a user clicked ?
   */
  private isClicked: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
    private authenticationStore: AuthenticationStore,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.accounts = [];

    this.subscriptions.push(
      this.authenticationStore.user$.subscribe(user => this.onNextUser(user)),
    );

    this.subscriptions.push(
      combineLatest([
        this.authenticationStore.signIn$,
        this.runtimeService.selectPermissions(),
      ])
      .subscribe(([user, permissions]) => this.onNextSignIn(user, permissions)),
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
   * Clicked an account
   */
  onClickAccount(account: AccountModel): void {

    // Prevent spam click
    if (this.isClicked) {

      return;
    }

    this.isClicked = true;

    // Track user action
    this.trackerService.trackUser(TrackingActionEnum.userSwitch, this.user);

    this
      .authenticationService
      .switchUser(account.id, account.login)
      .subscribe(
        data => {

          // Error
          if (data.success === false) {

            this.isClicked = false;

            // Error notification
            this.runtimeService.notification(NotificationTypeEnum.failure, 'notification_rollback');

            return;
          }

          // Success
          if (data.success === true) {

            /**
             * TODO[later] When project is a complete SPA
             * - Should call this.runtimeService.reset() ==> dispatch ResetAction.
             * - Should not reload page when switching user.
             * - Should not reset session storage here, but as an @effect of ResetAction.
             */
            this.sessionStorageService.removeItem(SessionStorageEnum.runtimeData);

            // Store the refresh token in local storage, to inform all tabs that it's changed
            this.localStorageService.setItem(LocalStorageEnum.rfRefreshToken, data.refresh_token);

            // Reload page
            this.browserService.reload();
          }
        },
        error => this.isClicked = false,
      );
  }

  /**
   * Menu toggle
   */
  onClickMenu(): void {

    this.isMenuActive = !this.isMenuActive;
  }

  /**
   * Load users list
   */
  private loadUserList(): void {

    this
      .authenticationService
      .switchList()
      .subscribe(accounts => {

        this.accounts = accounts;

        // Update available accounts list
        this.authenticationStore.setAvailableUsers(accounts);
      });
  }

  /**
   * Next sign in
   */
  private onNextSignIn(user: UserModel, permissions: PermissionEnum[]): void {

    if (!user.id || permissions.indexOf(PermissionEnum.userSwitch) === -1) {

      return;
    }

    this.loadUserList();
  }

  /**
   * Next user
   */
  private onNextUser(user: UserModel): void {

    this.user = user;
  }
}
