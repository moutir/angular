import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AutocompleteApiService } from './autocomplete-api.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';

describe('AutocompleteApiService', () => {

  let service: AutocompleteApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AutocompleteApiService,
        PhalconHttpService,
      ],
    });

    service = TestBed.get(AutocompleteApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  describe('search()', () => {

    it('should return Observable<AutocompleteSuggestionInterface[]>', () => {

      const search = {
        entities: [EntityEnum.property, EntityEnum.contact],
        query: 'geneva',
        archived: false,
        limit: 10,
      };

      const response = [
        {
          entity: 'contact',
          options: [
            { text: 'abc - abc@realforce.ch', value: '80128' },
          ],
        },
        {
          entity: 'property',
          options: [
            { value: 'property_2', text: 'RF-TEST1-001 - 45, chemin de partal - Geneva' },
            { value: 'property_51', text: 'M11111 - Quai de Corsier 8 - Corsier' },
          ],
        },
      ];

      service.search(search)
        .subscribe(res => {

          expect(res.length).toBe(2);
          expect(res[0].entity).toEqual('contact');
          expect(res[0].options.length).toEqual(1);
          expect(res[0].options[0].value).toEqual('80128');
          expect(res[1].entity).toEqual('property');
          expect(res[1].options.length).toEqual(2);
          expect(res[1].options[0].value).toEqual('property_51');
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.autocompleteSearch));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });
});
