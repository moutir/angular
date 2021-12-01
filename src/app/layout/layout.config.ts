import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';

@Injectable()
export class LayoutConfig {

  readonly defaultPath: string;
  readonly bgColor: string;
  readonly logo: string;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<LayoutConfig>().layout;

    // Store config in memory
    this.defaultPath = config.defaultPath;
    this.bgColor = config.bgColor;
    this.logo = config.logo;
  }
}
