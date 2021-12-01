import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ContractService } from '../../../core/shared/contract/contract.service';
import { ContractPageService } from '../../../core/shared/contract/contract-page.service';
import { ContractModel } from '../../../shared/model/contract.model';
import { ContractOptionsInterface } from '../../../shared/interface/contract-options.interface';
import { ContractUpsert } from '../../data-contract/actions/contract-upsert';
import { ContractEventLoadEntity } from '../actions/contract-event-load-entity';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { FormService } from '../../../core/shared/form.service';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { PropertyModel } from '../../../shared/model/property.model';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PropertyUpsert } from '../../data-property/actions/property-upsert';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { PropertyService } from '../../../core/shared/property/property.service';

@Injectable()
export class PageEffects extends EffectsAbstract<ContractModel, ContractOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ContractPageService,
    protected modelService: ContractService,
    private propertyService: PropertyService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Load contract's property on contract load success
   *
   * @action PageEventChangeModel
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    map(action => {

      const contract = <ContractModel>action.payload.model;

      return new ContractEventLoadEntity({
        entity: EntityEnum.property,
        entityId: <string>contract.property.id,
      });
    })),
  );

  /**
   * Update contract's property on change
   *
   * @action PageEventChangeModel
   */
  PageEventChangeModelProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'propertyId'),
    map(action => new ContractEventLoadEntity({
      entity: EntityEnum.property,
      entityId: <string>action.payload.input.value,
    })),
  ));

  /**
   * Perform API call to load entity
   *
   * @action ContractEventLoadEntity
   */
  ContractEventLoadEntity$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContractEventLoadEntity>(ContractEventLoadEntity.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const newModel = model.clone<ContractModel>();

      // No ID selected
      if (!action.payload.entityId) {

        newModel.property = new PropertyModel();

        return [

          // Update model
          new PageUpdateModel({
            model: newModel,
          }),
        ];
      }

      const propertyFilters = new PropertySearchModel();
      propertyFilters.ids = [ action.payload.entityId ];

      // API call
      return this
        .propertyService
        .list(
          { page: 1, perPage: 1 },
          { id: 'id', order: OrderEnum.asc },
          propertyFilters,
        ).pipe(

          // Success
          switchMap(list => {

            newModel.property = list.models[0];
            newModel.currencyId = newModel.property.currencyId;
            newModel.currencyLabel = newModel.property.currencyLabel;
            newModel.askingPrice = newModel.property.price;

            return [

              // Upsert property
              new PropertyUpsert({
                models: [newModel.property],
              }),

              // Update model
              new PageUpdateModel({
                model: newModel,
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '56', error: error }),
          ]),
        );
    })),
  );

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: ContractModel): Action {

    return new ContractUpsert({
      models: [model],
    });
  }
}
