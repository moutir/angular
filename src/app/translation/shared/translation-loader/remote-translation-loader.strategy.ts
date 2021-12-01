import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../../api/http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';

@Injectable()
export class RemoteTranslationLoaderStrategy implements TranslateLoader {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load translations JSON
   */
  getTranslation(lang: string): Observable<Object> {

    return this
      .httpService
      .get(ApiEndpointEnum.i18nMessages)
      .pipe(
        map(translations => {

          let index = 0;
          const q = ['{{', '}}'];

          // Replace % by {{ and }} alternatively
          const str = JSON
            .stringify(translations)
            .replace(/%/g, () => {

              index++;

              return q[index % 2];
            });

          return JSON.parse(str);
        }),
      );
  }
}
