import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, switchMap, withLatestFrom } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { LeadModel } from '../../../shared/model/lead.model';
import { LeadPageService } from '../../../core/shared/lead/lead-page.service';
import { LeadService } from '../../../core/shared/lead/lead.service';
import { LeadUpsert } from '../../data-lead/actions/lead-upsert';
import { FormService } from '../../../core/shared/form.service';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { LeadEventLoadSubsource } from '../actions/lead-event-load-subsource';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { PropertyService } from '../../../core/shared/property/property.service';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { HelperService } from '../../../core/shared/helper.service';
import { LeadEventLoadValidation } from '../actions/lead-event-load-validation';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { LeadUpdateIsActiveValidation } from '../actions/lead-update-is-active-validation';
import { LeadEventSaveValidation } from '../actions/lead-event-save-validation';
import { ContactModel } from '../../../shared/model/contact.model';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { LeadOptionsInterface } from '../../../shared/interface/lead-options.interface';

@Injectable()
export class PageEffects extends EffectsAbstract<LeadModel, LeadOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: LeadPageService,
    protected modelService: LeadService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private helperService: HelperService,
    private runtimeService: RuntimeService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Update page model on open
   *
   * @action PageEventOpen
   */
  PageEventOpen2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      // Not write page
      if (action.payload.type !== PageTypeEnum.write) {

        return [

          // Update contact validation active state
          new LeadUpdateIsActiveValidation({
            isActive: false,
          }),
        ];
      }

      const newModel = new LeadModel();

      // Set default values
      newModel.contactDate = new Date();
      newModel.contactTime = this.helperService.getTimeString(newModel.contactDate, true);

      return [

        // Update model
        new PageUpdateModel({
          model: newModel,
        }),
      ];
    }),
  ));

  /**
   * Load lead resources on page model load
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

      const model = <LeadModel>action.payload.model;
      const actions: Action[] = [];
      const propertyId: string = model.getProperty().id;
      const promotionId: string = model.getPromotion().id;

      // Read page
      if (pageType === PageTypeEnum.read && model.sourceId) {

        // Load subsources for source ID
        actions.push(
          new LeadEventLoadSubsource({
            sourceId: model.sourceId,
          }),
        );
      }

      if (propertyId) {

        const propertyFilters = new PropertySearchModel();
        propertyFilters.ids = [propertyId];

        // Load property
        actions.push(
          new EntityEventList({
            entity: EntityEnum.property,
            pagination: { page: 1, perPage: 1 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: propertyFilters,
          }),
        );
      }

      if (promotionId) {

        const promotionFilters = new PromotionSearchModel();
        promotionFilters.promotionIds = [promotionId];

        // Load promotion
        actions.push(
          new EntityEventList({
            entity: EntityEnum.promotion,
            pagination: { page: 1, perPage: 1 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: promotionFilters,
          }),
        );
      }

      // Write page AND contact validation needed
      if (pageType === PageTypeEnum.write && model.id && model.isNeedValidation === true) {

        // Load contact validation
        actions.push(
          new LeadEventLoadValidation({
            id: model.id,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Load sub source on source change
   *
   * @action PageEventChangeModel input.name === 'sourceId'
   */
  PageEventChangeModelSource$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'sourceId'),
    switchMap(action => [

      // Load subsources for source ID
      new LeadEventLoadSubsource({
        sourceId: <string>action.payload.input.value,
      }),
    ]),
  ));

  /**
   * Update property in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.property
   */
  EntityEventChangedProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.lead && action.payload.entity === EntityEnum.property),
    switchMap(([action, entity]) => zip(
      of(action),
      this.propertyService.selectProperties(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, properties, model]) => {

      const pageModel = model.clone<LeadModel>();
      pageModel.properties = pageModel.properties.map(property => properties[property.id] || new PropertyModel());

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
   * Update promotion in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.promotion
   */
  EntityEventChangedPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.lead && action.payload.entity === EntityEnum.promotion),
    switchMap(([action, entity]) => zip(
      of(action),
      this.promotionService.selectPromotions(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, promotions, model]) => {

      const pageModel = model.clone<LeadModel>();
      pageModel.promotions = pageModel.promotions.map(promotion => promotions[promotion.id] || new PromotionModel());

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
   * Load property on property change
   *
   * @action PageEventChangeModel input.name === 'properties'
   */
  PageEventChangeModelProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'properties'),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const values = (action.payload.input.value as PropertyModel[]).map(val => val.id);

      // Change on page load
      if (values.length === 0 && model[action.payload.input.name].length === 0) {

        return [];
      }

      // Just added a property
      if (values.length > model[action.payload.input.name].length ||
        (values.length === 1 && values[0] !== model[action.payload.input.name][0])) {

        const propertyFilters = new PropertySearchModel();
        propertyFilters.ids = values;

        return [

          // Load properties
          new EntityEventList({
            entity: EntityEnum.property,
            pagination: { page: 1, perPage: 100 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: propertyFilters,
          }),
        ];
      }

      return [];
    }),
  ));

  /**
   * Load promotion on promotion change
   *
   * @action PageEventChangeModel input.name === 'promotions'
   */
  PageEventChangeModelPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'promotions'),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const values = (action.payload.input.value as PromotionModel[]).map(val => val.id);

      // Change on page load
      if (values.length === 0 && model[action.payload.input.name].length === 0) {

        return [];
      }

      // Just added a promotion
      if (values.length > model[action.payload.input.name].length ||
        (values.length === 1 && values[0] !== model[action.payload.input.name][0])) {

        const promotionFilters = new PromotionSearchModel();
        promotionFilters.promotionIds = values;

        return [

          // Load promotions
          new EntityEventList({
            entity: EntityEnum.promotion,
            pagination: { page: 1, perPage: 100 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: promotionFilters,
          }),
        ];
      }

      return [];
    }),
  ));

  /**
   * Update type label on type change
   *
   * @action PageEventChangeModel input.name === 'typeId'
   */
  PageEventChangeModelType$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'typeId'),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectOptions(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, options, model]) => {

      const pageModel = model.clone<LeadModel>();
      const typeOption = options.leadType.find(opt => opt.value === action.payload.input.value);
      pageModel.typeId = String(action.payload.input.value);
      pageModel.typeLabel = typeOption ? typeOption.text : '';

      return [

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),
      ];
    }),
  ));

  /**
   * @inheritDoc
   */
  PageEventClickMenuItem$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickMenuItem>(PageEventClickMenuItem.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      // Send email
      if (action.payload.menuItem.id === OperationEnum.leadSendEmail) {

        this.modelService.sendEmail([model]);
      }

      return [];
    }),
  ));

  /**
   * Perform API call to fetch contact validation configuration
   *
   * @action LeadEventLoadValidation
   */
  LeadEventLoadValidation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LeadEventLoadValidation>(LeadEventLoadValidation.TYPE),
    switchMap(action => {

      // API call
      return this
        .modelService
        .loadValidation(action.payload.id)
        .pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([validation, model]) => {

            const pageModel = model.clone<LeadModel>();

            pageModel.contact = validation.contact;
            pageModel.matchingContacts = validation.matchingContacts;

            if (pageModel.matchingContacts.length > 0) {

              pageModel.validationOptionId = 2;
            }

            return [

              // Update page model
              new PageUpdateModel({
                model: pageModel,
              }),
            ];
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '62', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to save contact validation
   *
   * @action LeadEventSaveValidation
   */
  LeadEventSaveValidation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LeadEventSaveValidation>(LeadEventSaveValidation.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      // API call
      return this
        .modelService
        .saveValidation(model)
        .pipe(

          // Success
          switchMap(contactModel => {

            if (!contactModel.id) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_rollback',
                }),
              ];
            }

            const pageModel = model.clone<LeadModel>();

            pageModel.contact = contactModel;
            pageModel.validationContact = new ContactModel();
            pageModel.isNeedValidation = false;

            return [

              // Update page model
              new PageUpdateModel({
                model: pageModel,
              }),

              // Update contact validation active state
              new LeadUpdateIsActiveValidation({
                isActive: false,
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_rollback',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '63', error: error }),
          ]),
        );
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: LeadModel): Action {

    return new LeadUpsert({
      models: [model],
    });
  }
}
