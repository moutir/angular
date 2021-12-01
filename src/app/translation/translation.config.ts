import { Injectable } from '@angular/core';
import { Dictionary } from 'app/shared/class/dictionary';

import { BrowserService } from '../core/shared/browser/browser.service';

@Injectable()
export class TranslationConfig {

  /**
   * Key/value pairs of translations
   */
  readonly dictionary: Dictionary<string> = {};

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<TranslationConfig>().translation;

    // Store config in memory
    this.dictionary = config.dictionary || this.dictionary;
  }
}
