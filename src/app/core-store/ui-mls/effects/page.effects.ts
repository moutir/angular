import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { MlsPageService } from '../../../core/shared/mls/mls-page.service';
import { MlsService } from '../../../core/shared/mls/mls.service';
import { MlsModel } from '../../../shared/model/mls.model';
import { FormService } from '../../../core/shared/form.service';
import { MlsUpsert } from '../../data-mls/actions/mls.upsert';
import { MlsOptionsInterface } from '../../../shared/interface/mls-options.interface';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { MlsEventLoadAgency } from '../actions/mls-event-load-agency';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { MlsApiService } from '../../../api/shared/mls/mls-api.service';
import { PageUpdateAction } from '../../ui-page/actions/page-update-action';
import { PageActionEnum } from '../../../shared/enum/page-action.enum';
import { PageEventClickButton } from '../../ui-page/actions/page-event-click-button';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { MlsUpdateSelectedAgency } from '../actions/mls-update-selected-agency';
import { MlsUpdateSearchQuery } from '../actions/mls-update-search-query';
import { MlsUpdateIsLoadingAgency } from '../actions/mls-update-is-loading-agency';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { MlsEventListAgencies } from '../actions/mls-event-list-agencies';

@Injectable()
export class PageEffects extends EffectsAbstract<MlsModel, MlsOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: MlsPageService,
    protected modelService: MlsService,
    private mlsApiService: MlsApiService,
    private confirmService: ConfirmService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Update page model and load partner agency
   *
   * @action PageEventOpen
   */
   PageEventOpen2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.modelService.selectSelectedAgency(),
    )),
    switchMap(([action, agency]) => {

      if (action.payload.type === PageTypeEnum.read) {

        return [

          // Update selected agency
          new MlsUpdateSelectedAgency({
            agency: null,
          }),

          // Update search query
          new MlsUpdateSearchQuery({
            searchQuery: '',
          }),

          // Update loading
          new MlsUpdateIsLoadingAgency({
            isLoading: false,
          }),
        ];
      }

      if (!agency || action.payload.type !== PageTypeEnum.write) {

        return [

          // Update loading
          new MlsUpdateIsLoadingAgency({
            isLoading: false,
          }),
        ];
      }

      const pageModel = new MlsModel();
      pageModel.partnerAgency.id = agency.id;
      pageModel.partnerAgency.name = agency.name;

      return [

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),

        // Load partner agency
        new MlsEventLoadAgency({
          id: agency.id,
        }),
      ];
    }),
  ));

  /**
   * Reset search form or search for agencies
   *
   * @action PageEventChangeTabUid
   */
  PageEventChangeTabUid2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeTabUid>(PageEventChangeTabUid.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      // Tab: agencies
      if (action.payload.tabUid === PageTabEnum.mlsReadAgencies) {

        return [
          new MlsEventListAgencies({}),
        ];
      }

      return [];
    })),
  );

  /**
   * Load agency details on MLS load success
   *
   * @action PageEventChangeModel
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    map(action => {

      const mlsModel = <MlsModel>action.payload.model;

      return new MlsEventLoadAgency({
        id: mlsModel.partnerAgency.id,
      });
    })),
  );

  /**
   * @inheritDoc
   */
  PageEventClickButton2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickButton>(PageEventClickButton.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      ((action.payload.buttonType === ButtonTypeEnum.reject ||
      action.payload.buttonType === ButtonTypeEnum.terminate || action.payload.buttonType === ButtonTypeEnum.uninvite) ?
      this.confirmService.message('confirm_mls_operation_' + action.payload.buttonType) :
      of(true)),
      this.pageService.selectModel(),
    )),
    switchMap(([action, isValid, model]) => {

      if (isValid === false) {

        return [];
      }

      // Send invite
      if (action.payload.buttonType === ButtonTypeEnum.sendInvite) {

        return [
          new EntityEventOperation({
            entity: EntityEnum.mls,
            ids: [model.id],
            message: 'notification_mls_send_invite',
            operation: 'send-invite',
            apiCall: () => this.mlsApiService.sendInvite(model).pipe(
              map(response => {

                if (response === true) {

                  // Can deactivate page
                  this.pageService.setCanDeactivate(true);

                  // Redirect to list
                  this.pageService.redirect(PageTypeEnum.list, null);
                }

                return response;
              }),
            ),
          }),
        ];
      }

      if (action.payload.buttonType === ButtonTypeEnum.accept) {

        // Accept invitation
        return [
          new EntityEventOperation({
            entity: EntityEnum.mls,
            ids: [model.id],
            message: 'notification_mls_accept_invitation',
            operation: 'accept-invitation',
            apiCall: () => this.mlsApiService.acceptInvitation(model).pipe(
              map(response => {

                if (response === true) {

                  // Redirect to list
                  this.pageService.redirect(PageTypeEnum.list, null);
                }

                return response;
              }),
            ),
          }),
        ];
      }

      if (action.payload.buttonType === ButtonTypeEnum.reject) {

        // Reject invitation
        return [
          new EntityEventOperation({
            entity: EntityEnum.mls,
            ids: [model.id],
            message: 'notification_mls_reject_invitation',
            operation: 'reject-invitation',
            apiCall: () => this.mlsApiService.rejectInvitation(model).pipe(
              map(response => {

                if (response === true) {

                  // Redirect to list
                  this.pageService.redirect(PageTypeEnum.list, null);
                }

                return response;
              }),
            ),
          }),
        ];
      }

      if (action.payload.buttonType === ButtonTypeEnum.uninvite) {

        // Uninvite
        return [
          new EntityEventOperation({
            entity: EntityEnum.mls,
            ids: [model.id],
            message: 'notification_mls_uninvite',
            operation: 'uninvite',
            apiCall: () => this.mlsApiService.uninvite(model).pipe(
              map(response => {

                if (response === true) {

                  // Redirect to list
                  this.pageService.redirect(PageTypeEnum.list, null);
                }

                return response;
              }),
            ),
          }),
        ];
      }

      if (action.payload.buttonType === ButtonTypeEnum.terminate) {

        // Terminate partnership
        return [
          new EntityEventOperation({
            entity: EntityEnum.mls,
            ids: [model.id],
            message: 'notification_mls_terminate',
            operation: 'terminate',
            apiCall: () => this.mlsApiService.terminate(model).pipe(
              map(response => {

                if (response === true) {

                  // Redirect to list
                  this.pageService.redirect(PageTypeEnum.list, null);
                }

                return response;
              }),
            ),
          }),
        ];
      }

      return [];
    }),
  ));

  /**
   * Load partner agency on partner change
   *
   * @action PageEventChangeModel input.name === 'partnerAgency'
   */
  PageEventChangeModelPartner$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'partnerAgencyId'),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const mlsModel = <MlsModel>action.payload.model;

      if (!mlsModel.partnerAgency.id ||
        model.partnerAgency.id === mlsModel.partnerAgency.id) {

        return [];
      }

      return [

        // Load partner agency
        new MlsEventLoadAgency({
          id: mlsModel.partnerAgency.id,
        }),
      ];
    }),
  ));

  /**
   * Perform API call to load agency
   *
   * @action MlsEventLoadAgency
   */
  MlsEventLoadAgency$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<MlsEventLoadAgency>(MlsEventLoadAgency.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const newModel = model.clone<MlsModel>();

      return concat(

        // Update page action
        of(new PageUpdateAction({
          action: PageActionEnum.loading,
        })),

        // API call
        this
          .mlsApiService
          .loadAgencyProfile(action.payload.id)
          .pipe(

            // Success
            switchMap(agency => {

              newModel.partnerAgency = agency;

              return [

                // Update page action
                new PageUpdateAction({
                  action: PageActionEnum.none,
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
              new RuntimeEventError({ id: '70', error: error }),
            ]),
          ),
      );
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: MlsModel): Action {

    return new MlsUpsert({
      models: [model],
    });
  }
}
