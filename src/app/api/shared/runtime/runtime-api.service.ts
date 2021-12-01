import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { RuntimeDataResponseInterface } from './runtime-data-response.interface';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeDataRequestInterface } from './runtime-data-request.interface';

@Injectable()
export class RuntimeApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load runtime data linked to keys
   */
  data(keys: RuntimeDataEnum[]): Observable<RuntimeDataResponseInterface> {

    return this
      .httpService
      .get<RuntimeDataRequestInterface, RuntimeDataResponseInterface>(ApiEndpointEnum.runtimeData, {
        keys: keys.join(','),
      });
  }
}
