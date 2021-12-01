import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { AgencyLoadResponseInterface } from './agency-load-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';

@Injectable()
export class AgencyApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load agency
   */
  load(): Observable<AgencyLoadResponseInterface> {

    return this
      .httpService
      .get<null, AgencyLoadResponseInterface>(ApiEndpointEnum.agencyContractOptions);
  }
}
