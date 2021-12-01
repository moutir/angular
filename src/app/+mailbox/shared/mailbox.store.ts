import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { ImapSettingsModel } from './imap-settings.model';
import { MailboxListState } from './mailbox-list.state';

@Injectable()
export class MailboxStore {

  /**
   * Observables
   */
  imapSettings$: Observable<ImapSettingsModel>;
  emailListState$: Observable<MailboxListState>;

  /**
   * Subjects
   */
  private imapSettings: ReplaySubject<ImapSettingsModel>;
  private emailListState: ReplaySubject<MailboxListState>;

  /**
   * Constructor
   */
  constructor() {

    // Define subjects
    this.imapSettings = new ReplaySubject<ImapSettingsModel>(1);
    this.emailListState = new ReplaySubject<MailboxListState>(1);

    // Define observables
    this.imapSettings$ = this.imapSettings.asObservable();
    this.emailListState$ = this.emailListState.asObservable();
  }

  /**
   * Set IMAP settings
   */
  setImapSettings(imapSettings: ImapSettingsModel): void {

    this.imapSettings.next(imapSettings);
  }

  /**
   * Set email list state
   */
  setEmailListState(state: MailboxListState): void {

    this.emailListState.next(state);
  }
}
