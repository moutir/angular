import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';
import { ApiEndpointEnum } from '../shared/enum/api-endpoint.enum';

@Injectable()
export class FisherConfig {

  /**
   * API endpoint
   */
  readonly apiEndpoint: ApiEndpointEnum = ApiEndpointEnum.fisherValuation;

  /**
   * API key
   */
  readonly apiKey: string = '';

  /**
   * Current language
   */
  readonly languageCurrent: string = 'en';

  /**
   * Country restrictions
   */
  readonly countryRestrictions: string[] = ['ch'];

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<FisherConfig>().fisher;

    // Override default config
    this.apiEndpoint = <ApiEndpointEnum>config.apiEndpoint || this.apiEndpoint;
    this.apiKey = <ApiEndpointEnum>config.apiKey || this.apiKey;
    this.languageCurrent = config.languageCurrent || this.languageCurrent;
    this.countryRestrictions = config.countryRestrictions || this.countryRestrictions;
  }
}
