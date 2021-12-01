import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { PageServiceAbstract } from '../../shared/service/page.service.abstract';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { PageEventOpen } from './actions/page-event-open';
import { PageUpdateEntity } from './actions/page-update-entity';
import { PageUpdateIcon } from './actions/page-update-icon';
import { PageUpdateTabUid } from './actions/page-update-tab-uid';
import { PageUpdateType } from './actions/page-update-type';
import { PageUpdateModel } from './actions/page-update-model';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { PageEventClickButton } from './actions/page-event-click-button';
import { ButtonTypeEnum } from '../../shared/enum/button-type.enum';
import { PageTypeEnum } from '../../shared/enum/page-type.enum';
import { ModelServiceAbstract } from '../../shared/service/model-service.abstract';
import { PageEventLoadModel } from './actions/page-event-load-model';
import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { PageEventChangeModel } from './actions/page-event-change-model';
import { PageEventChangeTabUid } from './actions/page-event-change-tab-uid';
import { PageEventStoreModel } from './actions/page-event-store-model';
import { PageUpdateAction } from './actions/page-update-action';
import { PageActionEnum } from '../../shared/enum/page-action.enum';
import { PageEventStoreModelSuccess } from './actions/page-event-store-model-success';
import { FormUpdateModelError } from '../ui-form/actions/form-update-model-error';
import { FormService } from '../../core/shared/form.service';
import { PageUpdateId } from './actions/page-update-id';
import { PageEventClickMenuItem } from './actions/page-event-click-menu-item';
import { EntityEventOperationDone } from '../ui-entity/actions/entity-event-operation-done';
import { EntityEventOperation } from '../ui-entity/actions/entity-event-operation';
import { PageEventLoadModelSuccess } from './actions/page-event-load-model-success';
import { DocumentEventChangeList } from '../ui-document/actions/document-event-change-list';
import { FormUpdateGeneralError } from '../ui-form/actions/form-update-general-error';

export abstract class EffectsAbstract<Model extends ModelAbstract, Options> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: PageServiceAbstract<Model, Options>,
    protected modelService: ModelServiceAbstract<Model>,
  ) {

  }

  /**
   * Update page on open event
   *
   * @action PageEventOpen
   */
  PageEventOpen$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.modelService.select(action.payload.id),
    )),
    switchMap(([action, model]) => {

      // Define actions
      const actions: Action[] = [

        // Update action
        new PageUpdateAction({
          action: PageActionEnum.loading,
        }),

        // Update entity
        new PageUpdateEntity({
          entity: action.payload.entity,
        }),

        // Update ID
        new PageUpdateId({
          id: action.payload.id,
        }),

        // Update icon
        new PageUpdateIcon({
          icon: action.payload.icon,
        }),

        // Update type
        new PageUpdateType({
          type: action.payload.type,
        }),

        // Update tab UID to null (in order to display 1st tab by default)
        new PageUpdateTabUid({
          tabUid: null,
        }),

        // Update model
        new PageUpdateModel({
          model: model,
        }),
      ];

      // Page linked to a specific ID
      if (action.payload.id) {

        // Load model
        actions.push(new PageEventLoadModel({
          entity: action.payload.entity,
          id: action.payload.id,
        }));
      } else {

        // Update action
        actions.push(new PageUpdateAction({
          action: PageActionEnum.none,
        }));
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to load model
   *
   * @action PageEventLoadModel
   */
  PageEventLoadModel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModel>(PageEventLoadModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      // API call
      return this
        .pageService
        .load(action.payload.id)
        .pipe(

          // Success
          switchMap(model => {

            const upsertAction = this.getUpsertAction(model);
            const actions: Action[] = [];

            if (upsertAction) {

              // Upsert data model
              actions.push(upsertAction);
            }

            return [

              ...actions,

              // Event
              new PageEventLoadModelSuccess({
                entity: action.payload.entity,
                model: model,
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_api_failure',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '31', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform actions after load model success
   *
   * @action PageEventLoadModelSuccess
   */
  PageEventLoadModelSuccess$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => [

      // Update model
      new PageUpdateModel({ model: action.payload.model }),

      // Update action
      new PageUpdateAction({
        action: PageActionEnum.none,
      }),
    ])),
  );

  /**
   * Clicked page button
   *
   * @action PageEventClickButton
   */
  PageEventClickButton$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickButton>(PageEventClickButton.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
      this.pageService.selectType(),
    )),
    switchMap(([action, model, type]) => {

      // Add
      if (action.payload.buttonType === ButtonTypeEnum.add) {

        this.pageService.redirect(PageTypeEnum.write, null);
        return [];
      }

      // Edit
      if (action.payload.buttonType === ButtonTypeEnum.edit) {

        this.pageService.redirect(PageTypeEnum.write, model.id);
        return [];
      }

      // Search
      if (action.payload.buttonType === ButtonTypeEnum.search) {

        this.pageService.redirect(PageTypeEnum.search, null);
        return [];
      }

      // Search submit
      if (action.payload.buttonType === ButtonTypeEnum.searchSubmit) {

        this.pageService.redirect(PageTypeEnum.list, null);
        return [];
      }

      // Save
      if (action.payload.buttonType === ButtonTypeEnum.save) {

        this.pageService.storeModel();
        return [];
      }

      // Cancel
      if (action.payload.buttonType === ButtonTypeEnum.cancel) {

        // Search, Read, Add
        if (type === PageTypeEnum.search || type === PageTypeEnum.read || (type === PageTypeEnum.write && !model.id)) {

          this.pageService.redirect(PageTypeEnum.list, null);
          return [];
        }

        // Edit
        if (type === PageTypeEnum.write) {

          this.pageService.redirect(PageTypeEnum.read, model.id);
          return [];
        }

        // List
        if (type === PageTypeEnum.list) {

          this.pageService.redirect(null, null);
          return [];
        }
      }

      return [];
    }),
  ));

  /**
   * Clicked page menu item
   *
   * @action PageEventClickMenuItem
   */
  PageEventClickMenuItem$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickMenuItem>(PageEventClickMenuItem.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
      this.pageService.selectType(),
    )),
    switchMap(([action, model, type]) => {

      // Extend to implement specific logic

      return [];
    }),
  ));

  /**
   * Update model on change event
   *
   * @action PageEventChangeModel
   */
  PageEventChangeModel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    map(action => new PageUpdateModel({
      model: action.payload.model,
    }))),
  );

  /**
   * Update tab UID on tab UID change
   *
   * @action PageEventChangeTabUid
   */
  PageEventChangeTabUid$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeTabUid>(PageEventChangeTabUid.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    map(action => new PageUpdateTabUid({
      tabUid: action.payload.tabUid,
    }))),
  );

  /**
   * Store model on server
   *
   * @action PageEventStoreModel
   */
  PageEventStoreModel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventStoreModel>(PageEventStoreModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
      this.formService.selectModelError(this.pageService.getUid(PageTypeEnum.write)),
    )),
    switchMap(([action, model, modelError]) => {

      // Form has errors
      if (Object.keys(modelError).filter(field => !!modelError[field] === true).length > 0) {

        return of(
          new RuntimeEventNotification({
            type: NotificationTypeEnum.failure,
            message: 'notification_fix_form_errors',
          }),
        );
      }

      return concat(

        // Update page action
        of(new PageUpdateAction({
          action: PageActionEnum.primary,
        })),

        // API call
        this
          .pageService
          .save(model)
          .pipe(

            // Success
            switchMap(modelSave => {

              const actions: Action[] = [

                // Update page action
                new PageUpdateAction({
                  action: PageActionEnum.none,
                }),
              ];

              // Has validation errors
              if (Object.keys(modelSave.modelError).length > 0 || modelSave.generalError.length > 0) {

                // General errors
                if (modelSave.generalError.length > 0) {

                  // Update form general error
                  actions.push(
                    new FormUpdateGeneralError({
                      uid: this.pageService.getUid(PageTypeEnum.write),
                      generalError: modelSave.generalError,
                    }),
                  );

                  // Notification
                  actions.push(
                    new RuntimeEventNotification({
                      type: NotificationTypeEnum.failure,
                      message: 'notification_rollback',
                    }),
                  );
                }

                // Update form model error
                actions.push(
                  new FormUpdateModelError({
                    uid: this.pageService.getUid(PageTypeEnum.write),
                    modelError: modelSave.modelError,
                  }),
                );

                return actions;
              }

              // Notification
              actions.push(
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: this.pageService.getNotificationUpdate(),
                }),
              );

              // Event
              actions.push(
                new PageEventStoreModelSuccess({
                  entity: action.payload.entity,
                  model: model,
                }),
              );

              return actions;
            }),

            // Error
            catchError(apiError => [

              // Update page action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '32', error: apiError }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform actions after store model success
   *
   * @action PageEventStoreModelSuccess
   */
  PageEventStoreModelSuccess$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventStoreModelSuccess>(PageEventStoreModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      // Can deactivate page
      this.pageService.setCanDeactivate(true);

      // Redirect to read
      this.pageService.redirect(PageTypeEnum.list, null);

      return [];
    })),
  );

  /**
   * Update page before entity operation
   *
   * @action EntityEventOperation
   */
  EntityEventOperation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventOperation>(EntityEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectHeader(),
    )),
    switchMap(([action, header]) => {

      // Operation is an action of the header menu
      if (header.menu.items.map(item => item.id).indexOf(action.payload.operation) > -1) {

        // Update page action
        return of(new PageUpdateAction({
          action: PageActionEnum.secondary,
        }));
      }

      return [];
    })),
  );

  /**
   * Update page after entity operation done
   *
   * @action EntityEventOperationDone
   */
  EntityEventOperationDone$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventOperationDone>(EntityEventOperationDone.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectHeader(),
    )),
    switchMap(([action, header]) => {

      // Operation is an action of the header menu
      if (header.menu.items.map(item => item.id).indexOf(action.payload.operation) > -1) {

        // Update page action
        return of(new PageUpdateAction({
          action: PageActionEnum.none,
        }));
      }

      return [];
    })),
  );

  /**
   * Changed documents list
   *
   * @action DocumentEventChangeList
   */
  DocumentEventChangeList$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<DocumentEventChangeList>(DocumentEventChangeList.TYPE),
    filter(action => this.filterDocumentUid(action.payload.uid)),
    switchMap(action => [

      // Upsert data model
      this.getUpsertAction(<Model>action.payload.model),

      // Update model
      new PageUpdateModel({ model: action.payload.model }),
    ]),
  ));

  /**
   * Return true if the requested document UID matches the page expected document manager UIDs
   */
  protected filterDocumentUid(uid: string): boolean {

    return false;
  }

  /**
   * Return true if the requested entity matches the page entity
   */
  protected filterEntity(entity: EntityEnum): boolean {

    return entity === this.pageService.getEntity();
  }

  /**
   * Return the upsert action instance for the model passed in argument
   */
  protected abstract getUpsertAction(model: Model): Action;

}
