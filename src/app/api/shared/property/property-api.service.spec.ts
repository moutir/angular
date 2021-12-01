import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PropertyApiService } from './property-api.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { HelperService } from '../../../core/shared/helper.service';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

describe('PropertyApiService', () => {

  let service: PropertyApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        PropertyApiService,
        PhalconHttpService,
        HelperService,
      ],
    });

    service = TestBed.get(PropertyApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  describe('list()', () => {

    it('should return Observable<ModelListInterface<PropertyModel>>', () => {

      const pagination: PaginationInterface = {
        page: 1,
        perPage: 10,
      };

      const sort: SortInterface = {
        id: 'created',
        order: OrderEnum.asc,
      };

      const filters: PropertySearchModel = new PropertySearchModel();

      filters.type = ListTypeEnum.sell;
      filters.propertyIds = ['123', '234'];
      filters.contactId = '89';
      filters.categoryIds = ['5'];
      filters.prices = ['87654'];
      filters.bedrooms = ['2', '3'];
      filters.rooms = ['4', '5'];
      filters.livingArea = ['150'];
      filters.landArea = ['500'];
      filters.positionIds = ['111'];
      filters.viewIds = ['222'];
      filters.brokerIds = ['333'];
      filters.statusIds = ['444'];
      filters.promotionIds = ['555'];
      filters.publicationIds = ['666'];
      filters.rankingIds = ['888'];
      filters.agencyId = '1000';
      filters.publicationStatusId = '2000';
      filters.visibilityId = '3000';
      filters.isDirectTransaction01 = '1';
      filters.isPromotion01 = '1';
      filters.isSellToForeigner01 = '1';
      filters.isArchive01 = '1';

      const response = {
        data: [
          {
            id: '123',
            location: ['Switzerland'],
            broker: 'A',
            owner: [],
            broker2: { id: '890', initials: 'G' },
            owner2: [{ id: '567', initials: 'P'}],
            ranking: '3',
            photo_thumb: 'http://example.com/rf_default_property.jpg',
            photo_zoom: 'http://example.com/rf_default_property.jpg',
            reference: 'REF318',
            informations: '<b>Address : </b>4th Estate - 2133 Switzerland',
            create_datetime: '26/03/2019',
          },
          {
            id: '234',
            location: ['Geneva'],
            broker: 'B',
            owner: [],
            broker2: { id: '890', initials: 'G' },
            owner2: [{ id: '567', initials: 'P'}],
            ranking: '2',
            photo_thumb: 'http://example.com/rf_default_property.jpg',
            photo_zoom: 'http://example.com/rf_default_property.jpg',
            reference: 'REF202',
            informations: '<b>Address : </b>5th Estate - 38667 Geneva',
            create_datetime: '10/04/2019',
          },
        ],
        recordsTotal: '2',
      };

      service.list(pagination, sort, <PropertySearchModel>filters)
        .subscribe(res => {

          expect(res.models.length).toEqual(response.data.length);
          expect(res.total.toString()).toEqual(response.recordsTotal);
          expect((res.models[0]).constructor).toEqual(PropertyModel);
        })
      ;

      const request = httpMock.expectOne(
        req => req.url.includes(ApiEndpointEnum.propertyList.replace('{state}', 'active').replace('{type}', 'sell')),
      );

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('ids()', () => {

    it('should return Observable<string[]>', () => {

      const filters = {
        type: ListTypeEnum.sell,
        propertyIds: ['123', '234'],
      };

      const response = ['123', '234'];

      service.ids(<PropertySearchModel>filters)
        .subscribe(res => {

          expect(Array.isArray(res)).toBeTruthy();
          expect(typeof(res[0])).toBe('string');
        })
      ;

      const request = httpMock.expectOne(
        req => req.url.includes(ApiEndpointEnum.propertyIds.replace('{state}', 'active').replace('{type}', 'sell')),
      );

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });

  describe('updateRanking()', () => {

    it('should return Observable<PropertyRankingResponseInterface>', () => {

      const response = {
        success: true,
      };

      service.updateRanking('123', 3)
        .subscribe(res => {

          expect(typeof res).toBe('object');
          expect(Object.keys(res)[0]).toBe('success');
          expect(res.success).toBeTruthy();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.propertyUpdateRanking));

      expect(request.request.method).toBe('POST');
      request.flush(response);
    });
  });
});
