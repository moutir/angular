import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RuntimeApiService } from './runtime-api.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeDataResponseInterface } from './runtime-data-response.interface';
import { AreaUnitEnum } from '../../../shared/enum/area-unit.enum';

describe('RuntimeApiService', () => {

  let service: RuntimeApiService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        RuntimeApiService,
        PhalconHttpService,
      ],
    });

    service = TestBed.get(RuntimeApiService);
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  describe('data()', () => {

    let httpMock: HttpTestingController;

    beforeEach(() => {

      httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {

      httpMock.verify();
    });

    it('should return Observable<RuntimeDataInterface>', () => {

      const response: RuntimeDataResponseInterface = {
        settings: {
          per_page: [10, 25, 50, 100],
          language: {
            current: LanguageEnum.en,
            list: [LanguageEnum.en, LanguageEnum.fr, LanguageEnum.de, LanguageEnum.it],
          },
          currency_code: 'CHF',
          area_unit: AreaUnitEnum.sqm,
          map: {
            coordinates: {
              lat: 0.0,
              lng: 0.0,
            },
            zoom: 10,
          },
          export_limit: 0,
          email_limit: 300,
        },
      };

      service
        .data([RuntimeDataEnum.settings])
        .subscribe(res => {

          expect(res).toBe(response);
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.runtimeData));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });
});
