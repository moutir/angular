import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as rxjs from 'rxjs';

import { CountApiService } from './count-api.service';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { CountState } from '../../../layout/shared/count.state';

describe('CountApiService', () => {

  let service: CountApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        CountApiService,
        PhalconHttpService,
      ],
    });

    service = TestBed.get(CountApiService);
    httpMock = TestBed.get(HttpTestingController);

    spyOnProperty(rxjs, 'timer').and.callFake((time) => (() => rxjs.of(time)));
  });

  afterEach(() => {

    httpMock.verify();
  });

  describe('autoload()', () => {

    it('should return Observable<CountState>', () => {

      const intervalTime = 0;

      const response = {
        lead: 1,
        mailbox: 2,
        matching_contact: 4,
        matching_property: 5,
        matching_promotion: 6,
        contact_to_follow_up: 7,
        contact_invalid_email: 8,
        contact_no_search: 9,
        report_validation: 10,
      };

      service.autoload(intervalTime)
        .subscribe(res => {

          expect(res.leadCount).toBe(1);
          expect(res.mailboxCount).toBe(2);
          expect(res.matchingContactCount).toBe(4);
          expect(res.matchingPropertyCount).toBe(5);
          expect(res.matchingPromotionCount).toBe(6);
          expect(res.contactToFollowUpCount).toBe(7);
          expect(res.contactInvalidEmailCount).toBe(8);
          expect(res.contactNoSearchCount).toBe(9);
          expect(res.reportValidationCount).toBe(10);
          expect(res instanceof CountState).toBeTruthy();
        })
      ;

      const request = httpMock.expectOne(req => req.url.includes(ApiEndpointEnum.navigationCounts));

      expect(request.request.method).toBe('GET');
      request.flush(response);
    });
  });
});
