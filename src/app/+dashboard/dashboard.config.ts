import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';

@Injectable()
export class DashboardConfig {

  readonly sale: {
    transactionTypeId: string,
    contactTypeId: string,
    brokerTypeId: string,
  };
  readonly rent: {
    transactionTypeId: string,
    contactTypeId: string,
    brokerTypeId: string,
  };
  readonly canDrag: boolean;
  readonly isAdmin: boolean;
  readonly yearStart: number = 2010;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<DashboardConfig>().dashboard;

    // Store config in memory
    this.sale = config.sale;
    this.rent = config.rent;
    this.canDrag = config.canDrag;
    this.isAdmin = config.isAdmin;
    this.yearStart = config.yearStart || this.yearStart;
  }
}
