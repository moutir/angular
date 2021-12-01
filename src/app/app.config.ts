import { Injectable } from '@angular/core';

import { BrowserService } from './core/shared/browser/browser.service';

@Injectable()
/**
 * @deprecated Remove once fully on angular
 */
export class AppConfig {

  /**
   * Frontend version identifier
   */
  readonly version: string = '';

  /**
   * Current language
   */
  readonly languageCurrent: string = 'en';

  /**
   * Default language
   */
  readonly languageDefault: string = 'en';

  /**
   * List of available languages
   */
  readonly languageList: string[] = ['en', 'fr', 'de', 'it'];

  /**
   * Time interval for loading counts
   */
  readonly loadCountInterval: number = 300000; // 5 minutes

  /**
   * Hide rent or sales data ?
   */
  readonly hideSale: boolean;
  readonly hideRent: boolean;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<AppConfig>().app;

    // Override default config
    this.languageCurrent = config.languageCurrent || this.languageCurrent;
    this.languageDefault = config.languageDefault || this.languageDefault;
    this.languageList = config.languageList || this.languageList;
    this.loadCountInterval = config.loadCountInterval || this.loadCountInterval;
    this.hideSale = config.hideSale;
    this.hideRent = config.hideRent;
  }
}
