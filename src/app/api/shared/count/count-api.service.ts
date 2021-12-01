import { Injectable } from '@angular/core';
import { flatMap, map } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { CountState } from '../../../layout/shared/count.state';
import { CountResponseInterface } from '../layout/count-response.interface';

@Injectable()
export class CountApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Automatically load data counts every @intervalTime milliseconds
   */
  autoload(intervalTime: number): Observable<CountState> {

    return timer(0, intervalTime)
      .pipe(
        flatMap(() => this
          .httpService
          .get<null, CountResponseInterface>(ApiEndpointEnum.navigationCounts)),
      )
      .pipe(
        map(response => this.convertToCountResponseModel(response)),
      );
  }

  /**
   * Convert response to an email list model
   */
  private convertToCountResponseModel(response: CountResponseInterface): CountState {

    const countState = new CountState();

    countState.leadCount = response.lead;
    countState.leadToAnswerCount = response.lead_to_answer;
    countState.mailboxCount = response.mailbox;
    countState.matchingContactCount = response.matching_contact;
    countState.matchingPropertyCount = response.matching_property;
    countState.matchingPromotionCount = response.matching_promotion;
    countState.contactToFollowUpCount = response.contact_to_follow_up;
    countState.contactNoSearchCount = response.contact_no_search;
    countState.contactInvalidEmailCount = response.contact_invalid_email;
    countState.reportValidationCount = response.report_validation;

    return countState;
  }
}
