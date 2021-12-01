import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { LeadApiService } from '../../../api/shared/lead/lead-api.service';
import { SearchlistEventChangeInput } from '../../ui-searchlist/actions/searchlist-event-change-input';
import { LeadModel } from '../../../shared/model/lead.model';
import { LeadUpsert } from '../../data-lead/actions/lead-upsert';
import { LeadSearchlistService } from '../../../core/shared/lead/lead-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { LeadSearchModel } from '../../../shared/model/lead-search.model';
import { LeadSearchOptionsInterface } from '../../../shared/interface/lead-search-options.interface';
import { LeadService } from '../../../core/shared/lead/lead.service';
import { LeadEventLoadSubsource } from '../actions/lead-event-load-subsource';
import { SearchlistEventOperation } from '../../ui-searchlist/actions/searchlist-event-operation';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { LeadUpdateModifyStatus } from '../actions/lead-update-modify-status';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  LeadModel,
  LeadSearchModel,
  LeadSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: LeadService,
    protected searchlistService: LeadSearchlistService,
    protected leadApiService: LeadApiService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * Updates lead sub sources when source input is updated
   *
   * @action SearchlistEventChangeInput
   */
  SearchlistEventChangeInputSource$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventChangeInput>(SearchlistEventChangeInput.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.input.name === 'mainSourceId'),
    switchMap(action => [

      // Load subsource for source ID
      new LeadEventLoadSubsource({
        sourceId: <string>action.payload.input.value,
      }),
    ]),
  ));

  /**
   * Update modify status when starting "lead modify status" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.leadModifyStatus)
   */
  SearchlistEventOperationModifyStatus$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.leadModifyStatus),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    map(([action, selection]) => new LeadUpdateModifyStatus({
      modifyStatus: {
        statusId: '',
        leadIds: action.payload.ids ? action.payload.ids : selection.ids, // Selected leads
      },
    })),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: LeadModel[]): LeadUpsert {

    return new LeadUpsert({
      models: models,
    });
  }
}
