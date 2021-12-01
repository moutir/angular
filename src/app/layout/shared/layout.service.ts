import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, zip } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PositionInterface } from '../../shared/interface/position.interface';
import { LayoutEventUserMenu } from '../../core-store/ui-layout/actions/layout-event-user-menu';
import { StateInterface } from '../../core-store/state.interface';
import { LayoutEventOperation } from '../../core-store/ui-layout/actions/layout-event-operation';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { LayoutUpdateSidenav } from '../../core-store/ui-layout/actions/layout-update-sidenav';
import { SidenavInterface } from '../../shared/interface/sidenav.interface';
import { LayoutEventSearch } from '../../core-store/ui-layout/actions/layout-event-search';
import { selectUiSearch, selectUiSearchResults, selectUiSidenav } from '../../core-store/ui-layout/selectors';
import { HeaderSearchInterface } from '../../shared/interface/header-search.interface';
import { LayoutEventToggleSearch } from '../../core-store/ui-layout/actions/layout-event-toggle-search';
import { HeaderSearchResultInterface } from '../../shared/interface/header-search-result.interface';
import { AuthenticationStore } from '../../authentication/shared/authentication.store';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';

/**
 * @deprecated
 */
@Injectable()
export class LayoutService {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private authenticationStore: AuthenticationStore,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Select user menu
   */
  selectUserMenu(): Observable<MenuInterface> {

    return combineLatest([
      this.authenticationStore.accounts$,
      this.runtimeService.selectPermissions(),
    ])
    .pipe(map(([accounts, permissions]) => {

      const menu: MenuInterface = {
        items: [],
      };

      // My profile
      if (permissions.indexOf(PermissionEnum.accountMyProfile) > -1) {

        menu.items.push(
          {
            id: OperationEnum.userProfile,
            label: 'label_my_profile',
            isEnabled: true,
            icon: 'account_circle',
            tooltip: '',
            items: [],
          },
        );
      }

      // At least one account available
      if (accounts.length > 0) {

        menu.items.push({
          id: OperationEnum.userSwitch,
          label: 'label_switch_account',
          isEnabled: true,
          icon: 'sync_alt',
          tooltip: '',
          items: [],
        });
      }

      menu.items.push({
        id: OperationEnum.userHelp,
        label: 'label_online_help',
        isEnabled: true,
        icon: 'help',
        tooltip: '',
        items: [],
      });

      menu.items.push({
        id: OperationEnum.userSignout,
        label: 'label_sign_out',
        isEnabled: true,
        icon: 'power_settings_new',
        tooltip: '',
        items: [],
      });

      return menu;
    }));
  }

  /**
   * Select sidenav
   */
  selectSidenav(): Observable<SidenavInterface> {

    return this.store$.select(selectUiSidenav);
  }

  /**
   * Select header search
   */
  selectHeaderSearch(): Observable<HeaderSearchInterface> {

    return this.store$.select(selectUiSearch);
  }

  /**
   * Select header search results
   */
  selectHeaderSearchResults(): Observable<HeaderSearchResultInterface> {

    return this.store$.select(selectUiSearchResults);
  }

  /**
   * Update the legacy HTML element's content
   *
   * @deprecated TODO[legacy] Remove once CRM is on Angular only
   */
  updateLegacyContent(): void {

    const element = this.browserService.querySelector('#legacy');

    if (!element) {

      return;
    }

    element.innerHTML = '';
  }

  /**
   * Update legacy's <body>
   *
   * @deprecated TODO[legacy] Remove once CRM is on Angular only
   */
  updateLegacyBody(isFolded: boolean): void {

    const body = this.browserService.querySelector('body');

    if (!body) {

      return;
    }

    // Remove body classes
    body.classList.remove('layout');
    body.classList.remove('layout--fold');

    // Set body classes
    body.classList.add('layout');
    body.classList.add('layout--animation');

    if (isFolded) {

      body.classList.add('layout--fold');
    }
  }

  /**
   * Update the legacy property basket count HTML element's content
   *
   * @deprecated TODO[legacy] Remove once CRM is on Angular only
   */
  updateLegacyPropertyBasketCount(count: number): void {

    const element = this.browserService.querySelector('#basket-bullet');

    if (!element) {

      return;
    }

    element.innerHTML = count > 0 ? String(count) : '';
  }

  /**
   * Update the legacy contact basket count HTML element's content
   *
   * @deprecated TODO[legacy] Remove once CRM is on Angular only
   */
  updateLegacyContactBasketCount(count: number): void {

    const element = this.browserService.querySelector('#basket-bullet');

    if (!element) {

      return;
    }

    element.innerHTML = count > 0 ? String(count) : '';
  }

  /**
   * Display user menu at the given position
   */
  showUserMenu(position: PositionInterface): void {

    this.store$.dispatch(
      new LayoutEventUserMenu({
        position: position,
      }),
    );
  }

  /**
   * Hide sidenav
   */
  hideSidenav(): void {

    this
      .selectSidenav()
      .pipe(
        take(1),
        filter(sidenav => !!sidenav.uid),
      ).subscribe(sidenav => {

        this.store$.dispatch(
          new LayoutUpdateSidenav({
            sidenav: {
              uid: '',
              isLoading: false,
            },
          }),
        );
      });
  }

  /**
   * Perform search on query
   */
  searchQuery(query: string): void {

    this.store$.dispatch(
      new LayoutEventSearch({
        query: query,
      }),
    );
  }

  /**
   * Launch operation on IDs
   */
  operation(operation: string): void {

    this.store$.dispatch(
      new LayoutEventOperation({
        operation,
      }),
    );
  }

  /**
   * Show header search
   */
  showHeaderSearch(): void {

    this.store$.dispatch(new LayoutEventToggleSearch({
      isActive: true,
    }));
  }

  /**
   * Hide header search
   */
  hideHeaderSearch(): void {

    zip(
      this.selectHeaderSearch(),
      this.selectSidenav(),
    ).pipe(
      take(1),
      filter(([search, sidenav]) => search.isActive === true && !sidenav.uid),
    ).subscribe(([search, sidenav]) => {

      this.store$.dispatch(
        new LayoutEventToggleSearch({
          isActive: false,
        }),
      );
    });
  }
}
