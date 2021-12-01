import { Subscription } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { AuthenticationStore } from '../../authentication/shared/authentication.store';
import { UserModel } from '../../shared/model/user.model';
import { LayoutConfig } from '../layout.config';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { LayoutService } from '../shared/layout.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Is the search active ?
   */
  @Input() isActiveSearch: boolean = false;

  /**
   * Is the search disabled ?
   */
  @Input() isDisabledSearch: boolean = false;

  /**
   * Clicked on header
   */
  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Clicked on search button
   */
  @Output() clickSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Changed search input query
   */
  @Output() changeQuery: EventEmitter<string> = new EventEmitter<string>();

  /**
   * DOM element: Search input
   */
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;

  /**
   * Default route path
   */
  defaultPath: string = '';

  /**
   *  Logo URL
   */
  logoUrl: string = '';

  /**
   *  Avatar URL
   */
  avatarUrl: string = '';

  /**
   * User name
   */
  userName: string = '';

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private authenticationStore: AuthenticationStore,
    private layoutConfig: LayoutConfig,
    private layoutService: LayoutService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated user
    this.subscriptions.push(
      this.authenticationStore.user$.subscribe(user => this.onNextUser(user)),
    );
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Search input became active
    if (changes.isActiveSearch && this.isActiveSearch === true) {

      // Focus search input
      this.searchElementRef.nativeElement.focus();
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
   * Clicked on user
   */
  onClickUser(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.click.emit();

    this.layoutService.showUserMenu({
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on header
   */
  onClick(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.click.emit();
  }

  /**
   * Clicked on search button
   */
  onClickButtonSearch(event: MouseEvent): void {

    // Do nothing, as the search is disabled
    if (this.isDisabledSearch) {

      return;
    }

    event.stopPropagation();

    this.clickSearch.emit();
  }

  /**
   * Change query on search input
   */
  onChangeInputSearch(event: Event): void {

    this.changeQuery.emit(event.target['value']);
  }

  /**
   * Clicked on search input
   */
  onClickInputSearch(event: MouseEvent): void {

    event.stopPropagation();
  }

  /**
   * Returns the default path
   */
  getDefaultPath(): string {

    // Dashboard
    if (this.permissions.indexOf(PermissionEnum.dashboardRead) > -1) {

      return 'dashboard';
    }

    // Property
    if (this.permissions.indexOf(PermissionEnum.propertyRead) > -1) {

      return 'property/index/active/sell';
    }

    // Contact
    if (this.permissions.indexOf(PermissionEnum.contactRead) > -1) {

      return 'contact/active/contact';
    }

    // Lead
    if (this.permissions.indexOf(PermissionEnum.leadRead) > -1) {

      return 'lead';
    }

    // Task
    if (this.permissions.indexOf(PermissionEnum.taskRead) > -1) {

      return 'task';
    }

    // Reporting
    if (this.permissions.indexOf(PermissionEnum.reportingRead) > -1) {

      return 'reporting';
    }

    return '';
  }

  /**
   * Next user
   */
  private onNextUser(user: UserModel): void {

    this.userName = user.account.contact.getFullName() || user.account.contact.fullName;
    this.avatarUrl = user.account.contact.photoURL;
    this.logoUrl = user.account.contact.agency.logo.photoSmallURL || '/dist/assets/realforce/rf-logo.png';
    this.defaultPath = this.getDefaultPath();
  }
}
