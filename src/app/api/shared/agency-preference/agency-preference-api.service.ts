import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AgencyPreferenceSaveRequestInterface } from './agency-preference-save-request.interface';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeApiService } from '../runtime/runtime-api.service';
import { AgencyPreferenceLoadResponseInterface } from './agency-preference-load-response.interface';
import { AgencyPreferenceSaveResponseInterface } from './agency-preference-save-response.interface';

@Injectable()
export class AgencyPreferenceApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private runtimeApiService: RuntimeApiService,
  ) {

  }

  /**
   * Load agency preference
   */
  load(id: string): Observable<AgencyPreferenceLoadResponseInterface> {

    return this
      .runtimeApiService
      .data([RuntimeDataEnum.agencyPreference])
      .pipe(
        map(response => response.agency_preference),
      );
  }

  /**
   * Save preference
   */
  save(agencyPreference: AgencyPreferenceModel): Observable<AgencyPreferenceSaveResponseInterface> {

    const request: AgencyPreferenceSaveRequestInterface = {};

    Object
      .keys(agencyPreference)
      .forEach(key => {

        // Don't send ID nor _model__attributes
        if (['id', 'MODEL_ATTRIBUTES'].indexOf(key) > -1) {

          return;
        }

        // To snake case
        return request[key.replace(/[A-Z]+/g, (txt) => '_' + txt.toLowerCase())] = agencyPreference[key];
      });

    return this
      .httpService
      .post<AgencyPreferenceSaveRequestInterface, AgencyPreferenceSaveResponseInterface>(
        ApiEndpointEnum.agencySavePreference,
        request,
      );
  }
}
