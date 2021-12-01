import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MailboxApiService } from '../shared/mailbox-api.service';
import { MailboxStore } from '../shared/mailbox.store';
import { ImapSettingsModel } from '../shared/imap-settings.model';
import { MailboxListState } from '../shared/mailbox-list.state';
import { SettingsImapSaveRequestInterface } from '../../api/shared/mailbox/settings-imap-save-request.interface';

@Component({
  selector: 'app-imap-settings',
  templateUrl: './imap-settings.component.html',
  styleUrls: ['./imap-settings.component.scss'],
})
export class ImapSettingsComponent implements OnInit, OnDestroy {

  errorMessage = '';
  imapId: any = null;
  emailListState: MailboxListState;

  // TODO[later] need model
  model = {
    email: '',
    password: '',
    imapServer: '',
    imapPort: '993',
    novalidate_cert: 1,
    store_password: 0,
    no_ssl: 1,
  };

  /**
   * Is the component loading ?
   */
  isLoading: boolean = false;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private mailboxApiService: MailboxApiService,
    private mailboxStore: MailboxStore,
    private router: Router,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.emailListState = new MailboxListState();

    // Updated IMAP settings
    this.subscriptions.push(
      this.mailboxStore.imapSettings$.subscribe(imapSettings => this.onNextImapSettings(imapSettings)),
    );

    // Updated email list state
    this.subscriptions.push(
      this.mailboxStore.emailListState$.subscribe(state => this.onNextEmailListState(state)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setValues(data) {
    this.imapId = data.id;
    this.model = {
      email: data && data.login ? data.login : '',
      password: '',
      imapServer: data && data.server_name ? data.server_name : '',
      imapPort: data && data.server_port ? data.server_port : '',
      novalidate_cert: 1,
      store_password: data && data.store_password ? parseInt(data.store_password, 10) : 0,
      no_ssl: data && data.no_ssl && parseInt(data.no_ssl, 10) === 0 ? 1 : 0,
    };
  }

  onSubmit(form: NgForm): void {

    this.isLoading = true;
    this.imapId = null;

    const request: SettingsImapSaveRequestInterface = {
      email: form.value.email,
      password: form.value.password,
      'imap-server': form.value['imap-server'],
      'imap-port': form.value['imap-port'],
      store_password: !!form.value.store_password,
      no_ssl: form.value.no_ssl ? 0 : 1,
      novalidate_cert: form.value.novalidate_cert ? 1 : 0,
    };

    this
      .mailboxApiService
      .saveImapSettings(request)
      .subscribe((response) => {

        if (response && !response.success && response.msg.length > 0) {

          this.errorMessage = response.msg.length > 0 ? response.msg.join(',') : 'Wrong settings data! Please check and try again.';
          this.isLoading = false;
          return;
        }

        if (response && response.id) {
          this.setValues(response);
        }

        // Load IMAP settings
        this.mailboxApiService
          .loadImapSettings()
          .subscribe(imapSettings => {

            this.mailboxStore.setImapSettings(imapSettings);

            this.router.navigate(['/mailbox/inbox']);
          });
      }, (error) => {

        this.errorMessage = 'Wrong settings data! Please check and try again.';
        this.isLoading = false;
      });
  }

  /**
   * Load domain settings
   */
  loadDomainSettings(): void {

    this
      .mailboxApiService
      .loadDomainSettings(this.model.email)
      .subscribe((response) => {

        if (response && response.status) {

          this.model.imapServer = response.data && response.data.server_name ? response.data.server_name : '';
          this.model.imapPort = response.data && response.data.server_port ? response.data.server_port : '';
        }
      });
  }

  /**
   * Focus out of the email input
   */
  onFocusOutEmail(): void {

    this.loadDomainSettings();
  }

  /**
   * Clicked the back button
   */
  onClickBack(): void {

    this.navigateToEmailList();
  }

  /**
   * Navigate to the email list
   */
  private navigateToEmailList(): void {

    this.router.navigate(['/mailbox/inbox', this.emailListState.page], {
      queryParams: {
        q: this.emailListState.searchQuery || null,
        folder: this.emailListState.folderId || null,
      },
    });
  }

  /**
   * Next IMAP settings
   */
  private onNextImapSettings(imapSettings: ImapSettingsModel): void {

    this.setValues(imapSettings);
  }

  /**
   * Next email list state
   */
  private onNextEmailListState(state: MailboxListState): void {

    // Keep email list state
    this.emailListState = state;
  }
}
