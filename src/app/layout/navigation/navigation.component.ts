import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { AuthenticationStore } from '../../authentication/shared/authentication.store';
import { UserModel } from '../../shared/model/user.model';
import { LinkInterface } from '../shared/link.interface';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { LayoutConfig } from '../layout.config';
import { LayoutService } from '../shared/layout.service';
import { CountState } from '../shared/count.state';
import { CountStore } from '../shared/count.store';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { AppConfig } from '../../app.config';
import { CountApiService } from '../../api/shared/count/count-api.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';

@Component({
  selector: 'app-layout-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * List permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * List of options
   */
  @Input() options: RuntimeOptionsInterface;

  /**
   * Is the navigation folded ?
   */
  @Input() isFolded: boolean;

  /**
   * Are the navigation CSS animations activated ?
   */
  @Input() hasAnimation: boolean;

  /**
   * Folded the navigation
   */
  @Output() fold: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * DOM element
   */
  @ViewChild('navigation', { static: true }) navigationElementRef: ElementRef;

  /**
   * List of links
   */
  links: LinkInterface[];

  /**
   * Is the navigation position sticky ?
   */
  isSticky: boolean;

  /**
   * Position from the top
   */
  positionTop: number;

  /**
   * Default route path
   */
  defaultPath: string;

  /**
   * Background color of the header
   */
  bgColor: string;

  /**
   *  User logo
   */
  logo: string;

  /**
   * Is menu active
   */
  isMenuActive: boolean = false;

  /**
   * Last recorded browser scroll Y
   */
  private lastBrowserScrollY: number;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Counts
   */
  private countState: CountState = new CountState();

  /**
   * Autoload counts subscription
   */
  private autoloadCounterSubscription: Subscription;

  /**
   * Constructor
   */
  constructor(
    private authenticationStore: AuthenticationStore,
    private translateService: TranslateService,
    private router: Router,
    private browserService: BrowserService,
    private layoutConfig: LayoutConfig,
    private layoutService: LayoutService,
    private countStore: CountStore,
    private trackerService: TrackerService,
    private appConfig: AppConfig,
    private countApiService: CountApiService,
    private runtimeService: RuntimeService,
  ) {

    // Require runtime data updates
    this.runtimeService.requireData([
      RuntimeDataEnum.authentication,
      RuntimeDataEnum.feature,
      RuntimeDataEnum.permissions,
      RuntimeDataEnum.userPreference,
    ]);
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.isSticky = false;
    this.positionTop = 0;
    this.lastBrowserScrollY = 0;
    this.links = [];

    // Updated count state
    this.subscriptions.push(
      this.countStore.countState$.subscribe(countState => this.onNextCountState(countState)),
    );

    // Updated user
    this.subscriptions.push(
      this.authenticationStore.user$.subscribe(user => this.onNextUser(user)),
    );

    // Router events
    this.subscriptions.push(
      this.router.events.subscribe(e => this.onEventRouter(e)),
    );

    // Position the navigation element
    this.position();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.feature || changes.permissions) {

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
   * Track navigation links by ID
   */
  trackById(index: number, link: LinkInterface): string {

    return link.id;
  }

  /**
   * Clicked the folding button
   */
  onClickFolding(): void {

    this.fold.emit(!this.isFolded);

    this.trackerService.track(this.isFolded ? TrackingActionEnum.navigationUnfold : TrackingActionEnum.navigationFold);
  }

  /**
   * Menu toggle
   */
  onClickMenu(): void {

    this.isMenuActive = !this.isMenuActive;
  }

  /**
   * Clicked on a link
   */
  onClickLink(): void {

    this.isMenuActive = false;
  }

  /**
   * Clicked on a sub link
   */
  onClickSubLink(event: MouseEvent): void {

    event.stopPropagation();

    this.isMenuActive = false;
  }

  /**
   * Clicked the sub menu
   */
  onClickSubMenu(event: MouseEvent, link: string): boolean {

    event.preventDefault();
    event.stopPropagation();

    this.browserService.redirect(link);

    return false;
  }

  /**
   * Is the URL active ?
   */
  private isActive(url: string, isExactMatch?: boolean): boolean {

    const location = this.browserService.getWindow().location;

    return isExactMatch ?
      location.pathname === url :
      (location.pathname + location.search).indexOf(url) === 0
    ;
  }

  /**
   * Update navigation links
   */
  private update(): void {

    // Reset navigation links
    this.links = [];

    // Update menu links one by one
    this.updateDashboard();
    this.updateProperty();
    this.updateContact();
    this.updateLead();
    this.updateTask();
    this.updateMatching();
    this.updatePromotion();
    this.updateContract();
    this.updateAgenda();
    this.updateMailbox();
    this.updateReporting();
    this.updateAgency();

    // Update position
    this.position();
  }

  /**
   * Update navigation: dashboard
   */
  private updateDashboard(): void {

    // ACL: read
    if (this.permissions.indexOf(PermissionEnum.dashboardRead) === -1) {

      return;
    }

    const link: LinkInterface = {
      id: 'dashboard',
      label: this.translateService.instant('label_dashboard'),
      isActive: this.isActive('/dashboard'),
      route: ['dashboard'],
      sublinks: [],
      icon: 'pie_chart',
    };

    this.links.push(link);
  }

  /**
   * Update navigation: property
   */
  private updateProperty(): void {

    const readSale = !this.appConfig.hideSale && this.permissions.indexOf(PermissionEnum.propertyReadSale) > -1;
    const readRent = !this.appConfig.hideRent && this.permissions.indexOf(PermissionEnum.propertyReadRental) > -1;

    // ACL: read
    if (this.permissions.indexOf(PermissionEnum.propertyRead) === -1 || (readSale === false && readRent === false)) {

      return;
    }

    const category = readSale ? 'sell' : 'rental';

    const link: LinkInterface = {
      id: 'property',
      label: this.translateService.instant('label_properties'),
      isActive: this.isActive('/property/index/'),
      href: '/property/index/active/' + category,
      sublinks: [],
      icon: 'home_work',
    };

    link.sublinks.push({
      label: this.translateService.instant('label_property_active'),
      isActive: this.isActive('/property/index/active/'),
      href: link.href,
      icon: '',
    });

    link.sublinks.push({
      label: this.translateService.instant('label_property_archive'),
      isActive: this.isActive('/property/index/archive/'),
      href: '/property/index/archive/' + category,
      icon: '',
    });

    this.links.push(link);
  }

  /**
   * Update navigation: contact
   */
  private updateContact(): void {

    // ACL: read
    if (this.permissions.indexOf(PermissionEnum.contactRead) === -1) {

      return;
    }

    const link: LinkInterface = {
      id: 'contact',
      label: this.translateService.instant('label_contacts'),
      isActive: this.isActive('/contact'),
      href: '/contact/active/contact',
      sublinks: [],
      icon: 'account_circle',
    };

    link.sublinks.push({
      label: this.translateService.instant('label_contact_active'),
      isActive: this.isActive(link.href),
      href: link.href,
      icon: '',
    });

    link.sublinks.push({
      label: this.translateService.instant('label_contacts_archive'),
      isActive: this.isActive('/contact/archive/contact'),
      href: '/contact/archive/contact',
      icon: '',
    });

    this.links.push(link);
  }

  /**
   * Update navigation: lead
   */
  private updateLead(): void {

    // Feature not activated for the user
    if (this.feature.lead === false) {

      return;
    }

    this.links.push({
      id: 'lead',
      label: this.translateService.instant('label_leads_manager'),
      isActive: this.isActive('/leads'),
      sublinks: [],
      route: ['/leads'],
      icon: 'chat',
      count: this.countState.leadCount,
    });
  }

  /**
   * Update navigation: task
   */
  private updateTask(): void {

    // Feature not activated for the user
    if (this.feature.task === false) {

      return;
    }

    this.links.push({
      id: 'task',
      label: this.translateService.instant('label_tasks'),
      isActive: this.isActive('/task'),
      sublinks: [],
      route: ['/tasks'],
      icon: 'check_circle_outline',
    });
  }

  /**
   * Update navigation: matching
   */
  private updateMatching(): void {

    // Feature not activated for the user
    if (this.feature.matchingGlobal === false) {

      return;
    }

    const matchingCount = this.countState.matchingContactCount
      + this.countState.matchingPropertyCount
      + this.countState.matchingPromotionCount;

    const link: LinkInterface = {
      id: 'matching',
      label: this.translateService.instant('label_global_matching'),
      isActive: this.isActive('/matching-group'),
      route: ['/matching-group'],
      sublinks: [
        {
          label: this.translateService.instant('label_global_matching_grouped'),
          isActive: this.isActive('/matching-group'),
          route: ['/matching-group'],
          icon: '',
          count: matchingCount,
        },
        {
          label: this.translateService.instant('label-global-matching-history'),
          isActive: this.isActive('/matching', true),
          route: ['/matching'],
          icon: '',
        },
      ],
      icon: 'compare_arrows',
      count: matchingCount,
    };

    // Main navigation active if at least one child is active
    link.isActive = link.sublinks.some(child => child.isActive);

    this.links.push(link);
  }

  /**
   * Update navigation: promotion
   */
  private updatePromotion(): void {

    // Feature not activated for the user
    if (this.feature.promotion === false) {

      return;
    }

    const href = '/promotion/active';

    const link: LinkInterface = {
      id: 'promotion',
      label: this.translateService.instant('label_navigation_promotion'),
      isActive: this.isActive('/promotion/'),
      href: href,
      sublinks: [
        {
          label: this.translateService.instant('label_navigation_promotion_active'),
          isActive: this.isActive(href),
          href: href,
          icon: '',
        },
        {
          label: this.translateService.instant('label_navigation_promotion_archive'),
          isActive: this.isActive('/promotion/archive'),
          href: '/promotion/archive',
          icon: '',
        },
      ],
      icon: 'location_city',
    };

    // Main navigation active if at least one child is active
    link.isActive = link.sublinks.some(child => child.isActive);

    this.links.push(link);
  }

  /**
   * Update navigation: contract
   */
  private updateContract(): void {

    // Feature not activated for the user
    if (this.feature.contract === false) {

      return;
    }

    this.links.push({
      id: 'contract',
      label: this.translateService.instant('label_contracts'),
      isActive: this.isActive('/contract'),
      route: ['/contract'],
      sublinks: [],
      icon: 'description',
    });
  }

  /**
   * Update navigation: agenda
   */
  private updateAgenda(): void {

    // Feature not activated for the user
    if (this.feature.agenda === false) {

      return;
    }

    this.links.push({
      id: 'agenda',
      label: this.translateService.instant('label_agenda'),
      isActive: this.isActive('/agenda'),
      route: ['/agenda'],
      sublinks: [],
      icon: 'calendar_today',
    });
  }

  /**
   * Update navigation: mailbox
   */
  private updateMailbox(): void {

    // Feature not activated for the user
    if (this.feature.emailing === false && this.feature.mailbox === false) {

      return;
    }

    const link: LinkInterface = {
      id: 'mailbox',
      label: this.translateService.instant('label_mailbox'),
      isActive: false,
      route: null,
      sublinks: [],
      icon: 'email',
      count: this.feature.mailbox === true ? this.countState.mailboxCount : 0,
    };

    if (this.feature.mailbox === true) {

      link.sublinks.push({
        label: this.translateService.instant('label_email_inbox'),
        isActive: this.isActive('/mailbox/inbox') || this.isActive('/mailbox/view') || this.isActive('/mailbox/imap-settings'),
        route: ['mailbox/inbox'],
        icon: '',
        count: this.countState.mailboxCount,
      });
    }

    if (this.feature.emailing === true) {

      link.sublinks.push({
        label: this.translateService.instant('label_email_create'),
        isActive: this.isActive('/emailing'),
        route: ['/emailing'],
        icon: '',
      });

      link.sublinks.push({
        label: this.translateService.instant('label_email_history'),
        isActive: this.isActive('/email/sent'),
        route: ['/email/sent'],
        icon: '',
      });
    }

    // ACL: template read
    if (this.permissions.indexOf(PermissionEnum.mailboxTemplateRead) > -1) {

      link.sublinks.push({
        label: this.translateService.instant('label_email_template_plural'),
        isActive: this.isActive('/email-template'),
        route: ['/email-template'],
        icon: '',
      });
    }

    // Link main route
    link.route = link.sublinks[0].route;

    // Main navigation active if at least one child is active
    link.isActive = link.sublinks.some(child => child.isActive);

    this.links.push(link);
  }

  /**
   * Update navigation: reporting
   */
  private updateReporting(): void {

    // Feature not activated for the user
    if (this.feature.reporting === false) {

      return;
    }

    this.links.push({
      id: 'reporting',
      label: this.translateService.instant('label_reporting'),
      isActive: this.isActive('/report'),
      route: ['/report'],
      sublinks: [
        {
          label: this.translateService.instant('label_all_reports'),
          isActive: this.isActive('/report', true),
          route: ['/report'],
          icon: '',
        },
        {
        label: this.translateService.instant('label_validation_pool'),
        isActive: this.isActive('/reporting', true),
        route: ['/reporting'],
        icon: '',
        count: this.countState.reportValidationCount,
      }],
      icon: 'assignment',
      count: this.feature.reporting === true && this.countState.reportValidationCount,
    });
  }

  /**
   * Update navigation: agency
   */
  private updateAgency(): void {

    // ACL: read
    if (this.permissions.indexOf(PermissionEnum.agencyProfileRead) === -1) {

      return;
    }

    const link: LinkInterface = {
      id: 'agency',
      label: this.translateService.instant('label_my_agency'),
      isActive: this.isActive('/agency'),
      route: ['agency'],
      sublinks: [],
      icon: 'settings_applications',
    };

    this.links.push(link);
  }

  /**
   * Position the navigation element
   */
  private position(): void {

    const navigationHeight = this.navigationElementRef.nativeElement.offsetHeight;
    const bodyHeight = this.browserService.getBodyHeight();
    const browserHeight = this.browserService.getWindowHeight();
    const browserScrollY = this.browserService.getScrollY();

    // Update stickyness
    this.isSticky = bodyHeight > navigationHeight && browserScrollY > 0;

    // No stickyness
    if (this.isSticky === false) {

      // Reset position top
      this.positionTop = 0;

      return;
    }

    // Update position
    this.positionTop -= (browserScrollY - this.lastBrowserScrollY);

    // Maximum reached
    if (this.positionTop > 0) {

      this.positionTop = 0;
    }

    // Minimum reached
    if (this.positionTop < browserHeight - navigationHeight) {

      this.positionTop = browserHeight - navigationHeight;
    }

    // Update last recorded browser scroll Y
    this.lastBrowserScrollY = browserScrollY;
  }

  /**
   * Next count state
   */
  private onNextCountState(countState: CountState): void {

    this.countState = countState;

    this.update();
  }

  /**
   * Next user
   */
  private onNextUser(user: UserModel): void {

    // Set config values
    this.defaultPath = this.layoutConfig.defaultPath;
    this.bgColor = this.layoutConfig.bgColor;
    this.logo = this.layoutConfig.logo || '/dist/assets/realforce/rf-logo.png';

    // Existing autoload counter subscription
    if (this.autoloadCounterSubscription) {

      this.autoloadCounterSubscription.unsubscribe();
    }

    // Automatically load counters
    this.autoloadCounterSubscription = this.countApiService
      .autoload(this.appConfig.loadCountInterval)
      .subscribe(counts => this.countStore.setCountState(counts));

    // Update navigation
    this.update();
  }

  /**
   * Router emitted an event
   */
  private onEventRouter(e: Event): void {

    if (e instanceof NavigationEnd === false) {

      return;
    }

    // Update navigation on next cycle
    setTimeout(() => this.update());
  }

  @HostListener('window:scroll', [])
  private onScrollWindow(): void {

    // Position the navigation element
    this.position();
  }

  @HostListener('window:resize', [])
  private onResizeWindow(): void {

    // Position the navigation element
    this.position();
  }
}
