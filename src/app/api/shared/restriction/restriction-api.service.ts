import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';

import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { RestrictionListRequestInterface } from './restriction-list-request.interface';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { RestrictionSearchModel } from '../../../shared/model/restriction-search.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LegacyRestrictionDataInterface } from '../../format/legacy/data/legacy-restriction-data.interface';
import { LegacyRestrictionHydrator } from '../../format/legacy/data/legacy-restriction.hydrator';

@Injectable()
export class RestrictionApiService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private legacyRestrictionHydrator: LegacyRestrictionHydrator,
  ) {

    super();
  }

  /**
   * List restrictions
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: RestrictionSearchModel,
  ): Observable<ModelListInterface<RestrictionModel>> {

    const request = <RestrictionListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.module) {

      request.module = filters.module;
    }

    if (filters.name) {

      request.name = filters.name;
    }

    return this
      .httpService
      .get<RestrictionListRequestInterface, LegacyListResponseInterface<LegacyRestrictionDataInterface>>(
        ApiEndpointEnum.restrictionList,
        request,
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacyRestrictionHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Load restriction
   */
  load(id: string): Observable<RestrictionModel> {

    return this
      .httpService
      .get<{}, LegacyRestrictionDataInterface>(
        ApiEndpointEnum.restrictionLoad,
        null,
        { id: id },
        true,
      ).pipe(
        map(response => this.legacyRestrictionHydrator.hydrateModel(response)),
      );
  }

  /**
   * Save restriction
   */
  save(model: RestrictionModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<{ payload: string; }, LegacySaveResponseInterface>(
        ApiEndpointEnum.restrictionSave,
        {
          payload: JSON.stringify(this.legacyRestrictionHydrator.hydrateData(model)),
        },
        null,
        true,
      );
  }

  /**
   * Remove restriction
   */
  remove(id: string): Observable<boolean> {

    return this
      .httpService
      .delete<HttpRequest<void>, { success: boolean; }>(ApiEndpointEnum.restrictionDelete, null, { id })
      .pipe(
        map(response => response.success),
      );
  }
}
