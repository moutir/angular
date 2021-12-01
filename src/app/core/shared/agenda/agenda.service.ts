import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AgendaModel } from '../../../shared/model/agenda.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { AgendaApiService } from '../../../api/shared/agenda/agenda-api.service';

@Injectable()
export class AgendaService extends ModelServiceAbstract<AgendaModel> {

  /**
   * Constructor
   */
  constructor(
    private agendaApiService: AgendaApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): AgendaModel {

    return new AgendaModel();
  }

  /**
   * @inheritDoc
   */
  load(): Observable<AgendaModel> {

    return this.agendaApiService.load();
  }
}
