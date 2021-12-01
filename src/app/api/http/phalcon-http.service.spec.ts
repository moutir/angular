import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as rxjs from 'rxjs';

import { PhalconHttpService } from './phalcon-http.service';
import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';

describe('PhalconApiService', () => {

  let service: PhalconHttpService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        PhalconHttpService,
      ],
    });

    service = TestBed.get(PhalconHttpService);
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  describe('get()', () => {

    let httpMock: HttpTestingController;

    beforeEach(() => {

      service = TestBed.get(PhalconHttpService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {

      httpMock.verify();
    });

    it('should return Observable<Response>', () => {

      const response = {
        verified: true,
      };

      service.get(ApiEndpointEnum.mock)
        .subscribe(res => {

          expect(res['verified']).toBe(true);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });

    it('should catch error', () => {

      const throwErrorMock = spyOnProperty(rxjs, 'throwError').and.callFake((error) => (() => rxjs.of(error)));

      service.get(ApiEndpointEnum.mock)
        .subscribe(res => {

          expect(throwErrorMock).toHaveBeenCalled();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('GET');

      request.error(new ErrorEvent('Not found'));
    });
  });

  describe('post()', () => {

    let httpMock: HttpTestingController;

    beforeEach(() => {

      service = TestBed.get(PhalconHttpService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {

      httpMock.verify();
    });

    it('should return Observable<Response>', () => {

      const requestData = {
        is_verified: true,
      };

      const response = {
        success: true,
      };

      service.post(ApiEndpointEnum.mock, requestData)
        .subscribe(res => {

          expect(res['success']).toBe(true);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });

    it('should catch error', () => {

      const throwErrorMock = spyOnProperty(rxjs, 'throwError').and.callFake((error) => (() => rxjs.of(error)));

      service.post(ApiEndpointEnum.mock)
        .subscribe(res => {

          expect(throwErrorMock).toHaveBeenCalled();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('POST');

      request.error(new ErrorEvent('Server error'));
    });
  });

  describe('delete()', () => {

    let httpMock: HttpTestingController;

    beforeEach(() => {

      service = TestBed.get(PhalconHttpService);
      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {

      httpMock.verify();
    });

    it('should return Observable<Response>', () => {

      const response = {
        success: true,
      };

      service.delete(ApiEndpointEnum.mock)
        .subscribe(res => {

          expect(res['success']).toBe(true);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('DELETE');
      request.flush(response);
    });

    it('should catch error', () => {

      const throwErrorMock = spyOnProperty(rxjs, 'throwError').and.callFake((error) => (() => rxjs.of(error)));

      service.delete(ApiEndpointEnum.mock)
        .subscribe(res => {

          expect(throwErrorMock).toHaveBeenCalled();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.mock));

      expect(request.request.method).toBe('DELETE');

      request.error(new ErrorEvent('Server error'));
    });
  });
});
