import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';
import { RuntimeDataResponseInterface } from '../api/shared/runtime/runtime-data-response.interface';

@Injectable()
export class RuntimeConfig {

  /**
   * Runtime data response
   */
  readonly data: RuntimeDataResponseInterface = {};

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<RuntimeConfig>().runtime;

    // Store config in memory
    this.data = config.data || this.data;
  }
}
