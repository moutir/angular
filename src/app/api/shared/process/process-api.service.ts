import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ProcessModel } from '../../../shared/model/process.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ProcessListRequestInterface } from './process-list-request.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { ProcessSearchModel } from '../../../shared/model/process-search.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LegacyProcessDataInterface } from '../../format/legacy/data/legacy-process-data.interface';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { LegacyProcessHydrator } from '../../format/legacy/data/legacy-process.hydrator';

@Injectable()
export class ProcessApiService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private legacyProcessHydrator: LegacyProcessHydrator,
  ) {

    super();
  }

  /**
   * List processes
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ProcessSearchModel,
  ): Observable<ModelListInterface<ProcessModel>> {

    const request = <ProcessListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.statusId) {

      request.status = filters.statusId;
    }

    if (filters.typeId) {

      request.type = filters.typeId;
    }

    if (filters.agencyId) {

      request.agency_id = filters.agencyId;
    }

    return this
      .httpService
      .get<ProcessListRequestInterface, LegacyListResponseInterface<LegacyProcessDataInterface>>(
        ApiEndpointEnum.processList,
        request,
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacyProcessHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Load process
   */
  load(id: string): Observable<ProcessModel> {

    return this
      .httpService
      .get<{}, LegacyProcessDataInterface>(
        ApiEndpointEnum.processLoad,
        null,
        { id: id },
        true,
      ).pipe(
        map(response => this.legacyProcessHydrator.hydrateModel(response)),
      );
  }

  /**
   * Save process
   */
  save(model: ProcessModel): Observable<LegacySaveResponseInterface> {

    // Nothing to save!
    return of({});
  }

  /**
   * Remove process
   */
  remove(id: string): Observable<boolean> {

    // Nothing to save!
    return of(false);
  }
}
