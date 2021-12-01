import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { LocationStrategy } from '@angular/common';

import { BrowserService } from './core/shared/browser/browser.service';
import { AppConfig } from './app.config';
import { AuthenticationConfig } from './authentication/authentication.config';
import { AuthenticationStore } from './authentication/shared/authentication.store';
import { UserModel } from './shared/model/user.model';
import { LayoutService } from './layout/shared/layout.service';
import { LayoutStore } from './layout/shared/layout.store';
import { LocalStorageService } from './core/shared/storage/local-storage.service';
import { LocalStorageEnum } from './shared/enum/local-storage.enum';
import { CountStore } from './layout/shared/count.store';
import { TrackerService } from './core/shared/tracker/tracker.service';
import { TrackingActionEnum } from './shared/enum/tracking-action.enum';
import { RuntimeService } from './runtime/shared/runtime.service';
import { ContextualInterface } from './shared/interface/contextual.interface';
import { ContactService } from './core/shared/contact/contact.service';
import { ContactModel } from './shared/model/contact.model';
import { RuntimeFeatureInterface } from './shared/interface/runtime-feature.interface';
import { NotificationInterface } from './shared/interface/notification.interface';
import { PropertyModel } from './shared/model/property.model';
import { PropertyService } from './core/shared/property/property.service';
import { PromotionModel } from './shared/model/promotion.model';
import { PreviewImageInterface } from './shared/interface/preview-image.interface';
import { RuntimeOptionsInterface } from './shared/interface/runtime-options.interface';
import { LegacyService } from './core/shared/legacy.service';
import { PromotionService } from './core/shared/promotion/promotion.service';
import { NotificationTypeEnum } from './shared/enum/notification-type.enum';
import { UploadService } from './core/shared/upload.service';
import { UploadModel } from './shared/model/upload.model';
import { MenuInterface } from './shared/interface/menu.interface';
import { MenuItemInterface } from './shared/interface/menu-item.interface';
import { SidenavInterface } from './shared/interface/sidenav.interface';
import { HeaderSearchInterface } from './shared/interface/header-search.interface';
import { HeaderSearchResultInterface } from './shared/interface/header-search-result.interface';
import { PermissionEnum } from './shared/enum/permission.enum';
import { RuntimeContactTypeByGroupInterface } from './shared/interface/runtime-contact-type-by-group.interface';
import { AuthenticationService } from './core/shared/authentication/authentication.service';
import { ContactEmailModel } from './shared/model/contact-email.model';
import { RestrictionModel } from './shared/model/restriction.model';
import { RestrictionService } from './core/shared/restriction/restriction.service';
import { GalleryService } from './gallery/shared/gallery.service';
import { GalleryInterface } from './shared/interface/gallery.interface';
import { DocumentModel } from './shared/model/document.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeOptions$: Observable<RuntimeOptionsInterface>;
  runtimeContextual$: Observable<ContextualInterface>;
  runtimePreviewImage$: Observable<PreviewImageInterface>;
  runtimeContactTypeByGroup$: Observable<RuntimeContactTypeByGroupInterface>;
  previewContact$: Observable<ContactModel|null>;
  previewRestriction$: Observable<RestrictionModel|null>;
  promotionPreviewPromotion$: Observable<PromotionModel|null>;
  propertyPreviewProperty$: Observable<PropertyModel|null>;
  notification$: Observable<NotificationInterface|null>;
  uploads$: Observable<UploadModel[]>;
  isUploadStatusFolded$: Observable<boolean>;
  userMenu$: Observable<MenuInterface>;
  sideNav$: Observable<SidenavInterface>;
  headerSearch$: Observable<HeaderSearchInterface>;
  headerSearchResults$: Observable<HeaderSearchResultInterface>;
  gallery$: Observable<GalleryInterface>;

  /**
   * Is the layout ready to be displayed ?
   */
  isReady: boolean;

  /**
   * Is the layout folded ?
   */
  isFolded: boolean;

  /**
   * Are the layout CSS animations activated ?
   */
  hasAnimation: boolean;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private router: Router,
    private browserService: BrowserService,
    private translateService: TranslateService,
    private appConfig: AppConfig,
    private authenticationConfig: AuthenticationConfig,
    private authenticationStore: AuthenticationStore,
    private layoutService: LayoutService,
    private layoutStore: LayoutStore,
    private localStorageService: LocalStorageService,
    private countStore: CountStore,
    private trackerService: TrackerService,
    private locationStrategy: LocationStrategy,
    private runtimeService: RuntimeService,
    private contactService: ContactService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private legacyService: LegacyService,
    private uploadService: UploadService,
    private authenticationService: AuthenticationService,
    private restrictionService: RestrictionService,
    private galleryService: GalleryService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.isReady = false;
    this.hasAnimation = false;

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeOptions$ = this.runtimeService.selectOptions();
    this.runtimeContextual$ = this.runtimeService.selectContextual();
    this.runtimePreviewImage$ = this.runtimeService.selectPreviewImage();
    this.runtimeContactTypeByGroup$ = this.runtimeService.selectContactTypeByGroup();
    this.previewContact$ = this.contactService.selectPreviewContact();
    this.previewRestriction$ = this.restrictionService.selectPreviewRestriction();
    this.promotionPreviewPromotion$ = this.promotionService.selectPreviewPromotion();
    this.propertyPreviewProperty$ = this.propertyService.selectPreviewProperty();
    this.notification$ = this.runtimeService.selectNotification();
    this.uploads$ = this.uploadService.selectUploadList();
    this.isUploadStatusFolded$ = this.uploadService.selectIsFoldedStatusBar();
    this.userMenu$ = this.layoutService.selectUserMenu();
    this.sideNav$ = this.layoutService.selectSidenav();
    this.headerSearch$ = this.layoutService.selectHeaderSearch();
    this.headerSearchResults$ = this.layoutService.selectHeaderSearchResults();
    this.gallery$ = this.galleryService.select();

    // Load runtime data from storage
    this.runtimeService.fromStorage();

    // Set layout expanded from local storage
    this.layoutStore.setFolded(this.localStorageService.getItem(LocalStorageEnum.navigationFold) === '1');

    // Router events
    this.router.events.subscribe(e => this.onEventRouter(e));

    // Location events
    this.locationStrategy.onPopState(() => this.onPopState());

    // Configure translation service
    this.translateService.addLangs(this.appConfig.languageList);
    this.translateService
      .use(this.appConfig.languageCurrent)
      .subscribe(
        () => this.onLoadTranslation(),
        err => this.runtimeService.notification(NotificationTypeEnum.failure, 'Unable to load translations, please reload the page.'),
      );

    // Updated folded
    this.subscriptions.push(
      this.layoutStore.folded$.subscribe(isFolded => this.onNextState(isFolded)),
    );

    // User authentication
    this.authentication();

    // Expose Angular services to legacy javascript
    this.legacyService.expose();
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Window scroll
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    this.runtimeService.hideContextual();
  }

  /**
   * Window click
   */
  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {

    this.layoutService.hideHeaderSearch();
  }

  /**
   * Session storage or local storage updated
   */
  @HostListener('window:storage', ['$event'])
  onWindowStorage(event: StorageEvent): void {

    // No new values
    if (!event || !event.newValue) {

      return;
    }

    // New refresh token available
    if (event.key === LocalStorageEnum.rfRefreshToken) {

      this.authenticationService.resetToken();
      this.authenticationConfig.setRefreshToken(event.newValue);
    }

    // Refresh token expired
    if (event.key === LocalStorageEnum.rfRefreshTokenExpired) {

      // User logout
      this.authenticationService.logout();
    }
  }

  /**
   * Folded/unfolded navigation
   */
  onFold(isFolded: boolean): void {

    this.layoutStore.setFolded(isFolded);
  }

  /**
   * Contextual overlay clicked
   */
  onClickContextualOverlay(): void {

    this.runtimeService.hideContextual();
  }

  /**
   * Clicked on user menu item
   */
  onClickMenuItemUser(menuItem: MenuItemInterface): void {

    this.layoutService.operation(menuItem.id);
  }

  /**
   * Closed sidenav
   */
  onCloseSidenav(): void {

    this.layoutService.hideSidenav();
    this.layoutService.hideHeaderSearch();
  }

  /**
   * Clicked on header
   */
  onClickHeader(): void {

    this.layoutService.hideSidenav();
    this.layoutService.hideHeaderSearch();
  }

  /**
   * Clicked on header search button
   */
  onClickButtonHeaderSearch(): void {

    this.layoutService.showHeaderSearch();
  }

  /**
   * Changed header search query
   */
  onChangeHeaderSearchQuery(query: string): void {

    this.layoutService.searchQuery(query);
  }

  /**
   * Authenticate user
   */
  private authentication(): void {

    const user = new UserModel();

    // Use BE config
    user.id = this.authenticationConfig.account.id;

    // User contact
    user.account.contact.id = this.authenticationConfig.contact.id;
    user.account.contact.firstName = this.authenticationConfig.contact.firstName;
    user.account.contact.lastName = this.authenticationConfig.contact.lastName;
    user.account.contact.fullName = this.authenticationConfig.contact.genericFullName;
    user.account.contact.photoURL = this.authenticationConfig.contact.avatar;

    if (this.authenticationConfig.contact.mainEmail) {

      const email = new ContactEmailModel();
      email.emailId = this.authenticationConfig.contact.mainEmail;
      email.isMainEmail = true;
      user.account.contact.emails.push(email);
    }

    // User account
    user.account.contact.accountId = this.authenticationConfig.account.id;
    user.account.contact.accountTypeId = this.authenticationConfig.account.typeId;

    // User agency
    user.account.contact.agency.id = this.authenticationConfig.agency.id;
    user.account.contact.agency.name = this.authenticationConfig.agency.name;
    user.account.contact.agency.logo = new DocumentModel();
    user.account.contact.agency.logo.photoSmallURL = this.authenticationConfig.agency.logoURL;

    // Sign in user
    this.authenticationStore.setSignIn(user);
    this.authenticationStore.setUser(user);
    this.trackerService.setUser(user);

    // User has clicked on login button
    // TODO[later] Remove this logic from here and track signin on button click
    if (this.localStorageService.getItem(LocalStorageEnum.isLoginClicked)) {

      // Track login action
      this.trackerService.trackUser(TrackingActionEnum.userSignIn, user);

      // Remove flag as it is needed only on login
      this.localStorageService.removeItem(LocalStorageEnum.isLoginClicked);
    }
  }

  /**
   * Loaded translation
   */
  private onLoadTranslation(): void {

    // Set the app as ready
    this.isReady = true;

    // Activate CSS animations on next cycle
    setTimeout(() => this.hasAnimation = true);
  }

  /**
   * Router emitted an event
   */
  private onEventRouter(e: Event): void {

    // TODO[later]: Remove this once fully on Angular
    if (this.browserService.getWindow().hasDirtyForm) {

      this.router.navigateByUrl(this.router.url, { replaceUrl: true });

      return;
    }

    // Not navigation end
    if (e instanceof NavigationEnd === false) {

      return;
    }

    // Update legacy content
    this.layoutService.updateLegacyContent();

    // Stats
    this.trackerService.trackString(TrackingActionEnum.navigationChange, (<NavigationEnd>e).url);

    // Scroll to top
    this.browserService.scrollTo(0, 0, 300);
  }

  /**
   * Next state
   */
  private onNextState(isFolded: boolean): void {

    this.isFolded = isFolded;

    // Keep navigation folded state in local storage
    this.localStorageService.setItem(LocalStorageEnum.navigationFold, isFolded ? '1' : '0');

    // Update legacy <body>
    this.layoutService.updateLegacyBody(this.isFolded);
  }

  /**
   * Pop state location
   */
  private onPopState(): void {

    this.browserService.reload();
  }
}
