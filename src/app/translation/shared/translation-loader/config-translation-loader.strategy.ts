import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { TranslationConfig } from '../../translation.config';

@Injectable()
export class ConfigTranslationLoaderStrategy implements TranslateLoader {

  /**
   * Constructor
   */
  constructor(
    private translationConfig: TranslationConfig,
  ) {

  }

  /**
   * Load translations JSON
   */
  getTranslation(lang: string): Observable<Object> {

    let index = 0;
    const q = ['{{', '}}'];

    if (Object.keys(this.translationConfig.dictionary).length === 0) {

      console.error('No translations found in TranslationConfig');

      return of();
    }

    // Replace % by {{ and }} alternatively
    const str = JSON
      .stringify(this.translationConfig.dictionary)
      .replace(/%/g, () => {

        index++;

        return q[index % 2];
      })
    ;

    return of(JSON.parse(str));
  }
}
