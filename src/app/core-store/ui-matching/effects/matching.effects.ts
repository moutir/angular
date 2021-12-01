import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatchingApiService } from '../../../api/shared/matching/matching-api.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { MatchingEventWaiting } from '../actions/matching-event-waiting';

@Injectable()
export class MatchingEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private matchingApiService: MatchingApiService,
  ) {

  }

  /**
   * Perform API call to set matchings as waiting
   *
   * @action MatchingEventWaiting
   */
  MatchingEventWaiting$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MatchingEventWaiting>(MatchingEventWaiting.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.matching,
      ids: action.payload.matchingIds,
      message: 'notification_matching_waiting',
      operation: 'wait',
      apiCall: () => this.matchingApiService.wait(action.payload.matchingIds, ''),
    })),
  ));
}
