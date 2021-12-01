import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { AgendaLoadResponseInterface } from './agenda-load-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AgendaModel } from '../../../shared/model/agenda.model';

@Injectable()
export class AgendaApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load
   */
  load(): Observable<AgendaModel> {

    return this
      .httpService
      .get<null, AgendaLoadResponseInterface>(ApiEndpointEnum.agendaLoad)
      .pipe(
        map(response => {

          const model = new AgendaModel();
          model.id = 'agenda';
          model.calendarExportLink = response.calendar_export_link;

          return model;
        }),
      );
  }
}
