import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { MarketingExpensePageService } from '../../../core/shared/marketing-expense/marketing-expense-page.service';
import { MarketingExpenseService } from '../../../core/shared/marketing-expense/marketing-expense.service';
import { MarketingExpenseUpsert } from '../../data-marketing-expense/actions/marketing-expense.upsert';
import { FormService } from '../../../core/shared/form.service';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { LeadEventLoadSubsource } from '../../ui-lead/actions/lead-event-load-subsource';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { PropertyService } from '../../../core/shared/property/property.service';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';
import { MarketingExpensePropertyModel } from '../../../shared/model/marketing-expense-property.model';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { MarketingExpensePromotionModel } from '../../../shared/model/marketing-expense-promotion.model';
import { MarketingExpenseOptionsInterface } from '../../../shared/interface/marketing-expense-options.interface';

@Injectable()
export class PageEffects extends EffectsAbstract<MarketingExpenseModel, MarketingExpenseOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: MarketingExpensePageService,
    protected modelService: MarketingExpenseService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Load resources on page model load
   *
   * @action PageEventLoadModelSuccess
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectType(),
    )),
    switchMap(([action, pageType]) => {

      const model = <MarketingExpenseModel>action.payload.model;
      const actions: Action[] = [];
      const propertyIds: string[] = model.properties.map(p => p.property.id);
      const promotionIds: string[] = model.promotions.map(p => p.promotion.id);

      // Not read page
      if (pageType !== PageTypeEnum.read) {

        return [];
      }

      // Category ID
      if (model.mainCategoryId) {

        // Load sub categories for category ID
        actions.push(
          new LeadEventLoadSubsource({
            sourceId: model.mainCategoryId,
          }),
        );
      }

      // Property IDs
      if (propertyIds.length > 0) {

        const propertyFilters = new PropertySearchModel();
        propertyFilters.ids = propertyIds;

        // Load properties
        actions.push(
          new EntityEventList({
            entity: EntityEnum.property,
            pagination: { page: 1, perPage: 100 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: propertyFilters,
          }),
        );
      }

      // Promotion IDs
      if (promotionIds.length > 0) {

        const promotionFilters = new PromotionSearchModel();
        promotionFilters.promotionIds = promotionIds;

        // Load promotions
        actions.push(
          new EntityEventList({
            entity: EntityEnum.promotion,
            pagination: { page: 1, perPage: 100 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: promotionFilters,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Load sub category on category change
   *
   * @action PageEventChangeModel input.name === 'mainCategoryId'
   */
  PageEventChangeModelMainCategory$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'mainCategoryId'),
    switchMap(action => [

      // Load sub categories for category ID
      new LeadEventLoadSubsource({
        sourceId: <string>action.payload.input.value,
      }),
    ]),
  ));

  /**
   * Update properties in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.property
   */
  EntityEventChangedProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.marketingExpense && action.payload.entity === EntityEnum.property),
    switchMap(([action, entity]) => zip(
      of(action),
      this.propertyService.selectProperties(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, properties, model]) => {

      const pageModel = model.clone<MarketingExpenseModel>();
      pageModel.properties = pageModel.properties.map(property => {

        const expenseProperty = property.clone<MarketingExpensePropertyModel>();

        if (!properties[property.property.id]) {

          property.property.isLoading = false;

          return property;
        }

        expenseProperty.property = properties[property.property.id];

        return expenseProperty;
      });

      return [

        // Upsert data model
        this.getUpsertAction(pageModel),

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),
      ];
    })),
  );

  /**
   * Update promotions in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.promotion
   */
  EntityEventChangedPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.marketingExpense && action.payload.entity === EntityEnum.promotion),
    switchMap(([action, entity]) => zip(
      of(action),
      this.promotionService.selectPromotions(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, promotions, model]) => {

      const pageModel = model.clone<MarketingExpenseModel>();
      pageModel.promotions = pageModel.promotions.map(promotion => {

        const expensePromotion = promotion.clone<MarketingExpensePromotionModel>();

        if (!promotions[promotion.promotion.id]) {

          promotion.promotion.isLoading = false;

          return promotion;
        }

        expensePromotion.promotion = promotions[promotion.promotion.id];

        return expensePromotion;
      });

      return [

        // Upsert data model
        this.getUpsertAction(pageModel),

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),
      ];
    })),
  );

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: MarketingExpenseModel): Action {

    return new MarketingExpenseUpsert({
      models: [model],
    });
  }
}
