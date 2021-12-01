import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhalconHttpService } from '../../../api/http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { RemoteTranslationLoaderStrategy } from './';

describe('TranslationLoader', () => {

  let service: RemoteTranslationLoaderStrategy;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        RemoteTranslationLoaderStrategy,
        PhalconHttpService,
      ],
    });

    service = TestBed.get(RemoteTranslationLoaderStrategy);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  describe('getTranslation()', () => {

    it('should return Observable<Object>', () => {

      const lang = 'en';

      const response = {
        label_colors: 'Colours',
        label_company: 'Company',
      };

      service.getTranslation(lang)
        .subscribe(res => {

          expect(res['label_colors']).toBe('Colours');
          expect(res['label_company']).toBe('Company');
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.i18nMessages));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });
});
