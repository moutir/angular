import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JsonapiHttpService } from './jsonapi-http-service';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { JsonapiSaveRequestInterface } from './request/jsonapi-save-request.interface';
import { JsonapiGetRequestInterface } from './request/jsonapi-get-request.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { JsonapiDataInterface } from './structure/jsonapi-data.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';
import { JsonapiGetOneResponseInterface } from './response/jsonapi-get-one-response.interface';
import { JsonapiGetManyResponseInterface } from './response/jsonapi-get-many-response.interface';
import { JsonapiSaveResponseInterface } from './response/jsonapi-save-response.interface';

/**
 * Base JSONAPI API service to be extended for each entity that has its own endpoint
 */
export abstract class JsonapiApiServiceAbstract<
  Model extends ModelAbstract,
  SearchModel extends ListFiltersInterface,
  JsonapiGetRequest extends JsonapiGetRequestInterface,
  JsonapiData extends JsonapiDataInterface,
> {

  /**
   * Endpoint
   */
  protected endpoint: string = '';

  /**
   * Constructor
   */
  constructor(
    protected jsonapiHttpService: JsonapiHttpService,
  ) {

  }

  /**
   * Load record
   */
  load(id: string): Observable<JsonapiGetOneResponseInterface<JsonapiData>> {

    return this
      .jsonapiHttpService
      .load<JsonapiData, JsonapiGetRequest>(this.endpoint, id, this.getLoadRequest(id));
  }

  /**
   * List records
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: SearchModel,
  ): Observable<JsonapiGetManyResponseInterface<JsonapiData>> {

    return this
      .jsonapiHttpService
      .list<JsonapiData, JsonapiGetRequest>(this.endpoint, this.getListRequest(pagination, sort, search));
  }

  /**
   * Save record
   */
  save(model: Model): Observable<JsonapiSaveResponseInterface> {

    return this
      .jsonapiHttpService
      .save<JsonapiData>(this.endpoint, this.getSaveRequest(model), !!model.id);
  }

  /**
   * Remove record
   */
  remove(id: string): Observable<boolean> {

    return this
      .jsonapiHttpService
      .remove(this.endpoint, id)
      .pipe(
        map(response => response.status === 204),
      );
  }

  /**
   * Return a JSONAPI "load" request
   */
  protected abstract getLoadRequest(id: string): JsonapiGetRequest;

  /**
   * Return a JSONAPI "list" request
   */
  protected abstract getListRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    search: SearchModel,
  ): JsonapiGetRequest;

  /**
   * Return a JSONAPI "save" request
   */
  protected abstract getSaveRequest(model: Model): JsonapiSaveRequestInterface<JsonapiData>;
}
