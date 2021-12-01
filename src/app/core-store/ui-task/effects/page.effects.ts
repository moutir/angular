import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { TaskModel } from '../../../shared/model/task.model';
import { TaskPageService } from '../../../core/shared/task/task-page.service';
import { TaskService } from '../../../core/shared/task/task.service';
import { TaskUpsert } from '../../data-task/actions/task-upsert';
import { FormService } from '../../../core/shared/form.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { PropertyService } from '../../../core/shared/property/property.service';
import { TaskOptionsInterface } from '../../../shared/interface/task-options.interface';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { PropertyModel } from '../../../shared/model/property.model';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { AuthenticationStore } from '../../../authentication/shared/authentication.store';
import { ContactModel } from '../../../shared/model/contact.model';
import { TaskEventEntitiesFromRoute } from '../actions/task-event-entities-from-route';

@Injectable()
export class PageEffects extends EffectsAbstract<TaskModel, TaskOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: TaskPageService,
    protected modelService: TaskService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private contactService: ContactService,
    private runtimeService: RuntimeService,
    private authenticationStore: AuthenticationStore,
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
    switchMap(action => zip(
      of(action),
      this.authenticationStore.user$,
    )),
    switchMap(([action, authUser]) => {

      const newModel = new TaskModel();
      const contact = authUser.account.contact.clone<ContactModel>();

      newModel.brokers.push(contact);

      return [

        // Update model
        new PageUpdateModel({
          model: newModel,
        }),
      ];
    }),
  ));

  /**
   * Update page model entities from route
   *
   * @action TaskEventEntitiesFromRoute
   */
  TaskEventEntitiesFromRoute$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<TaskEventEntitiesFromRoute>(TaskEventEntitiesFromRoute.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
      this.runtimeService.selectOptions(),
    )),
    switchMap(([action, model, options]) => {

      // Do nothing for edit page
      if (model.id) {

        return [];
      }

      const newModel = model.clone<TaskModel>();
      const params = action.payload.queryParams;

      // Type
      newModel.typeId = params['task_type'] > 0 ? params['task_type'] : '';

      // Contact
      if (params['contact_id']) {

        const contact = new ContactModel();
        contact.id = params['contact_id'];
        contact.firstName = params['contact_firstname'] || '';
        contact.lastName = params['contact_lastname'] || '';
        contact.fullName = contact.getFullName();

        newModel.contacts = [ ...model.contacts, contact ];
      }

      // Property
      if (params['property_id']) {

        const property = new PropertyModel();
        property.id = params['property_id'];
        property.reference = params['property_reference'] || '';

        newModel.properties = [ ...model.properties, property ];
      }

      // Promotion
      if (params['promotion_id']) {

        const promotion = new PromotionModel();
        promotion.id = params['promotion_id'];
        promotion.name = params['promotion_name'] || '';

        newModel.promotions = [ ...model.promotions, promotion ];
      }

      const typeOption = options.taskType.find(opt => opt.value === newModel.typeId);

      // Generate task title
      newModel.typeLabel = typeOption ? typeOption.text : '';
      newModel.title = newModel.getGeneratedTitle();

      return [

        // Page model loaded
        new PageEventLoadModelSuccess({
          entity: this.pageService.getEntity(),
          model: newModel,
        }),
      ];
    }),
  ));

  /**
   * Load properties and promotions on page model load
   *
   * @action PageEventLoadModelSuccess
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      const model = <TaskModel>action.payload.model;
      const actions: Action[] = [];

      if (model.properties.length > 0) {

        const activeProperties = model.properties.filter(property => property.isArchived === false);
        const archiveProperties = model.properties.filter(property => property.isArchived === true);

        if (activeProperties.length > 0) {

          const propertyFilters = new PropertySearchModel();
          propertyFilters.ids = activeProperties.map(property => property.id);
          propertyFilters.isArchive01 = '0';

          // Load active properties
          actions.push(
            new EntityEventList({
              entity: EntityEnum.property,
              pagination: { page: 1, perPage: 100 },
              sort: { id: 'id', order: OrderEnum.asc },
              filters: propertyFilters,
            }),
          );
        }

        if (archiveProperties.length > 0) {

          const propertyFilters = new PropertySearchModel();
          propertyFilters.ids = archiveProperties.map(property => property.id);
          propertyFilters.isArchive01 = '1';

          // Load archive properties
          actions.push(
            new EntityEventList({
              entity: EntityEnum.property,
              pagination: { page: 1, perPage: 100 },
              sort: { id: 'id', order: OrderEnum.asc },
              filters: propertyFilters,
            }),
          );
        }
      }

      if (model.promotions.length > 0) {

        const activePromotions = model.properties.filter(property => property.isArchived === false);
        const archivePromotions = model.properties.filter(property => property.isArchived === true);

        if (activePromotions.length > 0) {

          const promotionFilters = new PromotionSearchModel();
          promotionFilters.promotionIds = activePromotions.map(promotion => promotion.id);
          promotionFilters.isArchive01 = '0';

          // Load active promotions
          actions.push(
            new EntityEventList({
              entity: EntityEnum.promotion,
              pagination: {page: 1, perPage: 100},
              sort: {id: 'id', order: OrderEnum.asc},
              filters: promotionFilters,
            }),
          );
        }

        if (archivePromotions.length > 0) {

          const promotionFilters = new PromotionSearchModel();
          promotionFilters.promotionIds = archivePromotions.map(promotion => promotion.id);
          promotionFilters.isArchive01 = '1';

          // Load active promotions
          actions.push(
            new EntityEventList({
              entity: EntityEnum.promotion,
              pagination: {page: 1, perPage: 100},
              sort: {id: 'id', order: OrderEnum.asc},
              filters: promotionFilters,
            }),
          );
        }
      }

      return actions;
    }),
  ));

  /**
   * Update task title on change type, person concerned, property or promotion
   *
   * @action PageEventChangeModel
   */
  PageEventChangeModelResources$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) &&
      (action.payload.input.name === 'typeId' || action.payload.input.name === 'contacts' ||
      action.payload.input.name === 'properties' || action.payload.input.name === 'promotions')),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectOptions(),
    )),
    switchMap(([action, options]) => {

      const pageModel = action.payload.model.clone<TaskModel>();

      // Title can not be auto generated
      if (pageModel.isTitleAutoGenerated === false) {

        return [];
      }

      const typeOption = options.taskType.find(opt => opt.value === pageModel.typeId);

      pageModel.typeLabel = typeOption ? typeOption.text : '';
      pageModel.title = pageModel.getGeneratedTitle();

      return [

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),
      ];
    }),
  ));

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
      if (values.length > model[action.payload.input.name].length) {

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
      if (values.length > model[action.payload.input.name].length) {

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
   * Update properties in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.property
   */
  EntityEventChangedProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.task && action.payload.entity === EntityEnum.property),
    switchMap(([action, entity]) => zip(
      of(action),
      this.propertyService.selectProperties(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, properties, model]) => {

      const pageModel = model.clone<TaskModel>();
      pageModel.properties = pageModel.properties.map(property => properties[property.id] || new PropertyModel());

      // Auto generated title
      if (pageModel.isTitleAutoGenerated === true) {

        // Update title, as it depends on property also
        pageModel.title = pageModel.getGeneratedTitle();
      }

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
    filter(([action, entity]) => entity === EntityEnum.task && action.payload.entity === EntityEnum.promotion),
    switchMap(([action, entity]) => zip(
      of(action),
      this.promotionService.selectPromotions(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, promotions, model]) => {

      const pageModel = model.clone<TaskModel>();
      pageModel.promotions = pageModel.promotions.map(promotion => promotions[promotion.id] || new PromotionModel());

      // Auto generated title
      if (pageModel.isTitleAutoGenerated === true) {

        // Update title, as it depends on promotion also
        pageModel.title = pageModel.getGeneratedTitle();
      }

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
   * Update page model on task update
   *
   * @action EntityEventChanged entity === EntityEnum.task
   */
  EntityEventChangedTask$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.task && action.payload.entity === EntityEnum.task),
    switchMap(([action, entity]) => zip(
      of(action),
      this.modelService.select(action.payload.ids[0]),
      this.pageService.selectType(),
    )),
    switchMap(([action, model, type]) => {

      // Read page
      if (type === PageTypeEnum.read) {

        return [

          // Update page model
          new PageUpdateModel({
            model: model,
          }),
        ];
      }

      return [];
    })),
  );

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

      const contactId = model.contacts.length > 0 ? model.contacts[0].id : null;

      // Send email
      if (action.payload.menuItem.id === OperationEnum.taskSendEmail) {

        this.contactService.sendEmail(model.contacts.map(c => c.id));
      }

      // Add to contacts basket
      if (action.payload.menuItem.id === OperationEnum.taskAddBasket) {

        this.contactService.addBasket([contactId]);
      }

      // Mark as progress/finished
      if (action.payload.menuItem.id === OperationEnum.taskMarkFinish) {

        this.modelService.updateFinished(model.id, !model.isFinished);
      }

      // Remove
      if (action.payload.menuItem.id === OperationEnum.taskRemove) {

        this.modelService.remove(model.id);
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: TaskModel): Action {

    return new TaskUpsert({
      models: [model],
    });
  }
}
