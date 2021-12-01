import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { PropertyUpdateTransfer } from '../actions/property-update-transfer';
import { SearchlistEventOperation } from '../../ui-searchlist/actions/searchlist-event-operation';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { PropertyUpdatePublication } from '../actions/property-update-publication';
import { PropertyUpsert } from '../../data-property/actions/property-upsert';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PropertyService } from '../../../core/shared/property/property.service';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PropertySearchOptionsInterface } from '../../../shared/interface/property-search-options.interface';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  PropertyModel,
  PropertySearchModel,
  PropertySearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: PropertyService,
    protected searchlistService: PropertySearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * Update transfer when starting "property transfer broker" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.propertyTransferBroker)
   */
  SearchlistEventOperationTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.propertyTransferBroker),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    map(([action, selection]) => new PropertyUpdateTransfer({
      transfer: {
        agencyId: '',
        brokerId: '',
        propertyIds: action.payload.ids ? action.payload.ids : selection.ids, // Selected properties
      },
    })),
  ));

  /**
   * Update publication when starting "property manage publication" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.propertyManagePublication)
   */
  SearchlistEventOperationPublication$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.propertyManagePublication),
    switchMap(action => zip(
      of(action),
      this.modelService.selectPublication(),
      this.searchlistService.selectSelection(action.payload.uid)),
    ),
    map(([action, publication, selection]) => {

      const newPublication = {
        ...publication,
        propertyIds: selection.ids,
      };

      return new PropertyUpdatePublication({
        publication: newPublication,
      });
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: PropertyModel[]): PropertyUpsert {

    return new PropertyUpsert({
      models: models,
    });
  }
}
