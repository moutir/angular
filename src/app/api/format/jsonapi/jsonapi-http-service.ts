import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SymfonyHttpService } from '../../http/symfony-http.service';
import { JsonapiGetOneResponseInterface } from './response/jsonapi-get-one-response.interface';
import { JsonapiGetManyResponseInterface } from './response/jsonapi-get-many-response.interface';
import { JsonapiSaveResponseInterface } from './response/jsonapi-save-response.interface';
import { JsonapiSaveRequestInterface } from './request/jsonapi-save-request.interface';
import { JsonapiDataInterface } from './structure/jsonapi-data.interface';
import { JsonapiGetRequestInterface } from './request/jsonapi-get-request.interface';

@Injectable()
export class JsonapiHttpService {

  /**
   * Constructor
   */
  constructor(
    protected httpService: SymfonyHttpService,
  ) {

  }

  /**
   * Load record
   */
  load<Data extends JsonapiDataInterface, Request extends JsonapiGetRequestInterface>(
    endpoint: string,
    id: string,
    request: Request,
  ): Observable<JsonapiGetOneResponseInterface<Data>> {

    return this
      .httpService
      .get<Request, JsonapiGetOneResponseInterface<Data>>(
        endpoint + '/{id}',
        request,
        { id },
      );
  }

  /**
   * List records
   */
  list<Data extends JsonapiDataInterface, Request extends JsonapiGetRequestInterface>(
    endpoint: string,
    request: Request,
  ): Observable<JsonapiGetManyResponseInterface<Data>> {

    return this
      .httpService
      .get<Request, JsonapiGetManyResponseInterface<Data>>(
        endpoint,
        request,
      );
  }

  /**
   * Save record
   */
  save<Data extends JsonapiDataInterface>(
    endpoint: string,
    request: JsonapiSaveRequestInterface<Data>,
    isUpdate: boolean,
  ): Observable<JsonapiSaveResponseInterface> {

    // Update
    if (isUpdate === true) {

      return this.httpService.patch<JsonapiSaveRequestInterface<Data>, JsonapiSaveResponseInterface>(
        endpoint + '/{id}',
        request,
        { id: request.data.id },
      );
    }

    // Create
    delete request.data.id;

    return this.httpService.post<JsonapiSaveRequestInterface<Data>, JsonapiSaveResponseInterface>(
      endpoint,
      request,
    );
  }

  /**
   * Remove record
   */
  remove(endpoint: string, id: string): Observable<HttpResponse<null>> {

    return this
      .httpService
      .delete<{}, HttpResponse<null>>(
        endpoint + '/{id}',
        { id },
        false,
        { observe: 'response' },
      );
  }
}
