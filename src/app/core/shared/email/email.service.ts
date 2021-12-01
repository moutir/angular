import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { EmailSummaryInterface } from '../../../shared/interface/email-summary.interface';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { EmailUpdateSummary } from '../../../core-store/ui-email/actions/email-update-summary';
import { TrackerService } from '../tracker/tracker.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { EmailApiService } from '../../../api/shared/email/email-api.service';
import { selectDataEmail } from '../../../core-store/data-email/selectors';
import { EmailModel } from '../../../shared/model/email.model';
import { EmailSearchModel } from '../../../shared/model/email-search.model';
import { selectUiSenderOptions, selectUiSummary } from '../../../core-store/ui-email/selectors';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { EmailEventListSender } from '../../../core-store/ui-email/actions/email-event-list-sender';
import { EmailContentModel } from '../../../shared/model/email-content.model';

@Injectable()
export class EmailService extends ModelServiceAbstract<EmailModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private trackerService: TrackerService,
    private emailApiService: EmailApiService,
    private translateService: TranslateService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): EmailModel {

    return new EmailModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: EmailSearchModel,
  ): Observable<ModelListInterface<EmailModel>> {

    return this.emailApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: EmailSearchModel): Observable<string[]> {

    return of([]);
  }

  /**
   * Load email content
   */
  emailContent(id: string): Observable<EmailContentModel|null> {

    return this.emailApiService.emailContent(id);
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<EmailModel|null> {

    return this.store$.select(selectDataEmail(id));
  }

  /**
   * Select summary
   */
  selectSummary(): Observable<EmailSummaryInterface> {

    return this.store$.select(selectUiSummary);
  }

  /**
   * Toggle summary modal
   */
  summary(summary: EmailSummaryInterface): void {

    this.store$.dispatch(
      new EmailUpdateSummary({ summary }),
    );
  }

  /**
   * Load email sent page
   */
  page(email: EmailModel): void {

    // Stats
    this.trackerService.trackString(TrackingActionEnum.emailSentView, email.id);

    this.summary({
      step: 1,
      email,
    });
  }

  /**
   * Load email sender options
   */
  loadSenderOptions(): void {

    this.store$.dispatch(
      new EmailEventListSender({}),
    );
  }

  /**
   * Select senders list options
   */
  selectSenderOptions(): Observable<OptionGroupInterface[]> {

    return this.store$
      .select(selectUiSenderOptions)
      .pipe(map(optionGroups => optionGroups.map(optionGroup => {

        return {
          ...optionGroup,
          label: this.translateService.instant(optionGroup.label), // TODO[later] remove once email send form is on Angular
        };
      })));
  }
}
