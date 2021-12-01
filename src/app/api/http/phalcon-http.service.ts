import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';
import { ApiParamsInterface } from '../../shared/interface/api-params.interface';
import { ApiErrorInterface } from '../../shared/interface/api-error.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { HttpParameterEncoder } from './http-parameter-encoder';

@Injectable()
export class PhalconHttpService {

  /**
   * Constructor
   */
  constructor(
    private httpClient: HttpClient,
  ) {

  }

  /**
   * Send a GET request to the API and returns an observable of a response
   */
  get<Request, Response>(
    endpoint: ApiEndpointEnum,
    request?: Request,
    params?: ApiParamsInterface,
    isNeededArrayParse?: boolean,
  ): Observable<Response> {

    // Send data
    return this
      .httpClient
      .get<Response>(this.getHttpUrl(endpoint, params), {
        headers: this.getHttpHeaders(),
        params: this.getHttpParams<Request>(request, isNeededArrayParse),
      })
      .pipe(
        catchError((error) => this.onError(error)),
      );
  }

  /**
   * Send a POST request to the API and returns an observable of a response
   */
  post<Request, Response>(
    endpoint: ApiEndpointEnum,
    request?: Request,
    params?: ApiParamsInterface,
    isFormUrlEncoded?: boolean,
    header?: Dictionary<string>,
    options?: Dictionary<string|boolean>,
  ): Observable<Response> {

    let headers = this.getHttpHeaders();
    let body: string;

    // Request should be x-www-form-urlencoded
    if (isFormUrlEncoded) {

      const httpParams = new URLSearchParams();

      if (request && typeof request === 'object') {

        Object
          .keys(request)
          .forEach(key => {

            if (request[key] instanceof Array) {

              request[key].forEach(value => httpParams.append((key + '[]'), value));
            } else {

              httpParams.set(key, request[key]);
            }
          });
      }

      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
      body = httpParams.toString();
    }

    // Custom headers
    if (header) {

      Object
        .keys(header)
        .forEach(key => {

          headers = headers.append(key, header[key]);
        });
    }

    return this
      .httpClient
      .post<Response>(this.getHttpUrl(endpoint, params), (body || request || {}), { headers, ...options })
      .pipe(
        catchError((error) => this.onError(error)),
      );
  }

  /**
   * Send a DELETE request to the API and returns an observable of a response
   */
  delete<Request, Response>(endpoint: ApiEndpointEnum, request?: Request, params?: ApiParamsInterface): Observable<Response> {

    const headers = this.getHttpHeaders();

    return this
      .httpClient
      .delete<Response>(this.getHttpUrl(endpoint, params), { headers })
      .pipe(
        catchError((error) => this.onError(error)),
      );
  }

  /**
   * Return HTTP headers for every API request
   */
  private getHttpHeaders(): HttpHeaders {

    let headers = new HttpHeaders();

    headers = headers.append('X-Requested-With', 'XMLHttpRequest');

    return headers;
  }

  /**
   * Return HTTP params for the given request payload
   */
  private getHttpParams<Request>(request: Request, isNeededArrayParse: boolean): HttpParams {

    let params = new HttpParams({ encoder: new HttpParameterEncoder() });

    if (request) {

      // Keep params that have a value, sort by key, then set params
      Object
        .keys(request)
        .filter(key => Array.isArray(request[key]) ? request[key].length > 0 : !!String(request[key]))
        .sort()
        .forEach(key => {

          if (isNeededArrayParse && request[key] instanceof Array) {

            request[key].forEach(value => params = params.append((key + '[]'), value));
          } else {

            params = params.set(key, request[key]);
          }
        });
    }

    return params;
  }

  /**
   * Return complete URL with injected params (example: replaces placeholder '{id}' by params.id)
   */
  private getHttpUrl(endpoint: ApiEndpointEnum, params?: ApiParamsInterface): string {

    // Request URL
    let url = environment.api.host.phalcon + endpoint;

    // Data to inject into endpoint string
    if (params) {

      Object
        .keys(params)
        .forEach(key => url = url.replace('{' + key + '}', params[key]));
    }

    return url;
  }

  /**
   * Error response from API
   */
  private onError(error: ApiErrorInterface): Observable<never> {

    return throwError(error);
  }
}
