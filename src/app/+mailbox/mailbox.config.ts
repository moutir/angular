import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';

@Injectable()
export class MailboxConfig {

  /**
   * Interval in milliseconds between 2 email syncs
   */
  readonly syncInterval: number = 600000;

  /**
   * Number of emails to load per page
   */
  readonly emailPerPage: number = 20;

  /**
   * Display email as thread of emails
   */
  readonly emailAsThread: boolean = true;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<MailboxConfig>().mailbox;

    // Store config in memory
    this.syncInterval = config.syncInterval || this.syncInterval;
    this.emailPerPage = config.emailPerPage || this.emailPerPage;
    this.emailAsThread = config.emailAsThread || this.emailAsThread;
  }
}
