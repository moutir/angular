import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { ReportingEventDownload } from '../../../core-store/ui-reporting/actions/reporting-event-download';
import { ReportingEventAccept } from '../../../core-store/ui-reporting/actions/reporting-event-accept';
import { ReportingEventReject } from '../../../core-store/ui-reporting/actions/reporting-event-reject';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { Observable, of } from 'rxjs';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { ReportingSearchModel } from '../../../shared/model/reporting-search.model';
import { ReportingApiService } from '../../../api/shared/reporting/reporting-api.service';

@Injectable()
export class ReportingService extends ModelServiceAbstract<ReportingModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private reportingApiService: ReportingApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ReportingModel {

    return new ReportingModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportingSearchModel,
  ): Observable<ModelListInterface<ReportingModel>> {

    return this.reportingApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: ReportingSearchModel): Observable<string[]> {

    return of([]);
  }

  /**
   * Download report
   */
  download(url: string): void {

    this.store$.dispatch(
      new ReportingEventDownload({ url }),
    );
  }

  /**
   * Accept reports
   */
  accept(reportIds: string[]): void {

    this.store$.dispatch(
      new ReportingEventAccept({ reportIds }),
    );
  }

  /**
   * Reject reports
   */
  reject(reportIds: string[]): void {

    this.store$.dispatch(
      new ReportingEventReject({ reportIds }),
    );
  }
}
