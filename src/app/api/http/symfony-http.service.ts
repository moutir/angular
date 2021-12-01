import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ApiParamsInterface } from '../../shared/interface/api-params.interface';
import { AuthenticationConfig } from '../../authentication/authentication.config';
import { RefreshTokenRequestInterface } from '../shared/symfony/refresh-token-request.interface';
import { RefreshTokenResponseInterface } from '../shared/symfony/refresh-token-response.interface';
import { JsonapiGetRequestInterface } from '../format/jsonapi/request/jsonapi-get-request.interface';
import { LocalStorageEnum } from '../../shared/enum/local-storage.enum';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { LocalStorageService } from '../../core/shared/storage/local-storage.service';
import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { HttpParameterEncoder } from './http-parameter-encoder';

@Injectable()
export class SymfonyHttpService {

  /**
   * JWT token
   */
  private token: string = '';

  /**
   * Constructor
   */
  constructor(
    private httpClient: HttpClient,
    private authenticationConfig: AuthenticationConfig,
    private browserService: BrowserService,
    private localStorageService: LocalStorageService,
  ) {

  }

  /**
   * Reset token
   */
  resetToken(): void {

    this.token = '';
  }

  /**
   * Send a GET request to the API and returns an observable of a response
   */
  get<Request extends JsonapiGetRequestInterface, Response>(
    endpoint: string,
    request?: Request,
    params?: ApiParamsInterface,
    isRetry: boolean = false,
  ): Observable<Response> {

    return this
      .httpClient
      .get<Response>(this.getHttpUrl(endpoint, params), {
        headers: this.getHttpHeaders(),
        params: this.getHttpParams<Request>(request),
      })
      .pipe(
        catchError(error => this.onError<Response>(
          error,
          isRetry ? null : () => this.get(endpoint, request, params, true),
        )),
      );
  }

  /**
   * Send a POST request to the API and returns an observable of a response
   */
  post<Request, Response>(
    endpoint: string,
    request?: Request,
    params?: ApiParamsInterface,
    isRetry: boolean = false,
    isFormUrlEncoded: boolean = false,
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

    return this
      .httpClient
      .post<Response>(this.getHttpUrl(endpoint, params), (body || request || {}), { headers: headers })
      .pipe(
        catchError(error => this.onError<Response>(
          error,
          isRetry ? null : () => this.post(endpoint, request, params, true),
        )),
      );
  }

  /**
   * Send a PATCH request to the API and returns an observable of a response
   */
  patch<Request, Response>(
    endpoint: string,
    request?: Request,
    params?: ApiParamsInterface,
    isRetry: boolean = false,
  ): Observable<Response> {

    return this
      .httpClient
      .patch<Response>(this.getHttpUrl(endpoint, params), request || {}, { headers: this.getHttpHeaders() })
      .pipe(
        catchError(error => this.onError<Response>(
          error,
          isRetry ? null : () => this.patch(endpoint, request, params, true),
        )),
      );
  }

  /**
   * Send a DELETE request to the API and returns an observable of a response
   */
  delete<Request, Response>(
    endpoint: string,
    params?: ApiParamsInterface,
    isRetry: boolean = false,
    options?: Dictionary<string|boolean>,
  ): Observable<Response> {

    return this
      .httpClient
      .delete<Response>(this.getHttpUrl(endpoint, params), { headers: this.getHttpHeaders(), ...options })
      .pipe(
        catchError(error => this.onError<Response>(
          error,
          isRetry ? null : () => this.delete(endpoint, params, true),
        )),
      );
  }

  /**
   * Return HTTP headers for every API request
   */
  private getHttpHeaders(): HttpHeaders {

    let headers = new HttpHeaders();

    headers = headers.append('Authorization', 'Bearer ' + this.token);

    return headers;
  }

  /**
   * Return HTTP params for the given request payload
   */
  private getHttpParams<Request extends JsonapiGetRequestInterface>(request: Request): HttpParams {

    let params = new HttpParams({ encoder: new HttpParameterEncoder() });

    // Fields
    if (request.fields) {

      Object
        .keys(request.fields)
        .filter(field => request.fields[field].length > 0)
        .sort()
        .forEach(field => params = params.set('fields[' + field + ']', request.fields[field].join(',')));
    }

    // Include
    if (request.include) {

      params = params.set('include', request.include.join(','));
    }

    // Filter
    if (request.filter) {

      Object
        .keys(request.filter)
        .sort()
        .forEach(filter => params = params.set('filter[' + filter + ']', request.filter[filter]));
    }

    // Page
    if (request.page) {

      Object
        .keys(request.page)
        .sort()
        .forEach(page => params = params.set('page[' + page + ']', request.page[page]));
    }

    return params;
  }

  /**
   * Return complete URL with injected params (example: replaces placeholder '{id}' by params.id)
   */
  private getHttpUrl(endpoint: string, params?: ApiParamsInterface): string {

    // Request URL
    let url = environment.api.host.symfony + endpoint;

    // Data to inject into endpoint string
    if (params) {

      Object
        .keys(params)
        .forEach(key => url = url.replace('{' + key + '}', params[key]));
    }

    return url;
  }

  /**
   * Request for a new JWT token
   */
  private refreshToken(): Observable<string> {

    return this
      .post<RefreshTokenRequestInterface, RefreshTokenResponseInterface>(
        '/api/token/refresh',
        {
          grant_type: 'refresh_token',
          refresh_token: this.authenticationConfig.symfonyCrm.refreshToken,
        },
        null,
        true,
        true,
      )
      .pipe(
        map(response => this.token = response.access_token),
        catchError(error => {

          // Refresh token expired
          if (this.authenticationConfig.symfonyCrm.refreshToken && error.code === 401) {

            // Signal other crm tabs about the token expiry, by updating local storage
            this.localStorageService.setItem(LocalStorageEnum.rfRefreshTokenExpired, 'true');

            // Remove the temporary key from local storage
            this.localStorageService.removeItem(LocalStorageEnum.rfRefreshTokenExpired);

            // Logout the user
            this.browserService.redirect(ApiEndpointEnum.accountLogout);

            return;
          }

          return this.onError<null>(error, null);
        }),
      );
  }

  /**
   * Error response from API
   */
  private onError<Response>(error: HttpErrorResponse, retryFn: null|(() => Observable<Response>)): Observable<Response|never> {

    // Unauthorized and not retrying yet
    if (error.status === 401 && retryFn !== null) {

      // Refresh JWT token
      return this.refreshToken()
        .pipe(
          switchMap(token => !token ? throwError('No token granted from API') : retryFn()),
        );
    }

    // Throw exception
    return throwError(error.error);
  }
}
