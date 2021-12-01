import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { StateInterface } from '../../../core-store/state.interface';
import { TrackerService } from '../tracker/tracker.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { MatchingSearchModel } from '../../../shared/model/matching-search.model';
import { MatchingGroupApiService } from '../../../api/shared/matching-group/matching-group-api.service';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingGroupSearchModel } from '../../../shared/model/matching-group-search.model';

@Injectable()
export class MatchingGroupService extends ModelServiceAbstract<MatchingGroupModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private trackerService: TrackerService,
    private matchingGroupApiService: MatchingGroupApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): MatchingGroupModel {

    return new MatchingGroupModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingGroupSearchModel,
  ): Observable<ModelListInterface<MatchingGroupModel>> {

    return this.matchingGroupApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: MatchingSearchModel): Observable<string[]> {

    return of([]);
  }
}
