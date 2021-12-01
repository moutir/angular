import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { TrackerService } from '../tracker/tracker.service';
import { MatchingEventWaiting } from '../../../core-store/ui-matching/actions/matching-event-waiting';
import { MatchingModel } from '../../../shared/model/matching.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { MatchingSearchModel } from '../../../shared/model/matching-search.model';
import { MatchingApiService } from '../../../api/shared/matching/matching-api.service';

@Injectable()
export class MatchingService extends ModelServiceAbstract<MatchingModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private trackerService: TrackerService,
    private matchingApiService: MatchingApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): MatchingModel {

    return new MatchingModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingSearchModel,
  ): Observable<ModelListInterface<MatchingModel>> {

    return this.matchingApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: MatchingSearchModel): Observable<string[]> {

    return this.matchingApiService.ids(filters);
  }

  /**
   * Set matchings as waiting
   */
  waiting(matchingIds: string[]): void {

    this.store$.dispatch(
      new MatchingEventWaiting({ matchingIds }),
    );
  }
}
