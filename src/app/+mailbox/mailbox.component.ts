import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MailboxStore } from './shared/mailbox.store';
import { MailboxApiService } from './shared/mailbox-api.service';
import { ImapSettingsModel } from './shared/imap-settings.model';
import { PageHeaderInterface } from '../shared/interface/page-header.interface';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit, OnDestroy {

  /**
   * Page header
   */
  header: PageHeaderInterface = {
    icon: 'email',
    title: 'label_mailbox',
    subtitles: ['label_email_inbox'],
    buttons: [],
    buttonsLoading: [],
    buttonsDisabled: [],
    menu: {
      items: [],
    },
  };

  /**
   * Is the component loading ?
   */
  isLoading: boolean;

  /**
   * List of whitelisted URLs that do not require IMAP settings
   */
  private whitelistUrl: string[] = [
    '/mailbox/imap-settings',
  ];

  /**
   * IMAP settings
   */
  private imapSettings: ImapSettingsModel;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private mailboxStore: MailboxStore,
    private mailboxApiService: MailboxApiService,
    private router: Router,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set loading
    this.isLoading = true;

    // Router events (will not emit for route loading this component for the first time)
    this.router.events.subscribe(e => this.onEventRouter(e));

    // Updated IMAP settings
    this.subscriptions.push(
      this.mailboxStore.imapSettings$.subscribe(imapSettings => this.onNextImapSettings(imapSettings)),
    );

    // Load IMAP settings
    this.mailboxApiService
      .loadImapSettings()
      .subscribe(imapSettings => this.mailboxStore.setImapSettings(imapSettings));
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Router emitted an event
   */
  private onEventRouter(e: Event) {

    if (e instanceof NavigationEnd === false) {

      return;
    }

    this.checkImapSettings();
  }

  /**
   * Next IMAP settings
   */
  private onNextImapSettings(imapSettings: ImapSettingsModel): void {

    // Keep new IMAP settings
    this.imapSettings = imapSettings;

    this.checkImapSettings();
  }

  /**
   * Check if IMAP settings are required for the current URL, if yes, redirect to IMAP settings page
   */
  private checkImapSettings(): void {

    // Not a mailbox route
    if (this.router.url.indexOf('/mailbox/') === -1) {

      return;
    }

    // IMAP settings invalid and URL not whitelisted
    if (this.imapSettings.isValid === false && this.whitelistUrl.indexOf(this.router.url) === -1) {

      // Redirect to IMAP settings route
      this.router.navigate(['/mailbox/imap-settings']);

      return;
    }

    // Set not loading
    this.isLoading = false;
  }
}
