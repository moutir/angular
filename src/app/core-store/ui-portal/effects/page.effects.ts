import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { concat, Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { PortalModel } from '../../../shared/model/portal.model';
import { PortalPageService } from '../../../core/shared/portal/portal-page-service';
import { PortalService } from '../../../core/shared/portal/portal.service';
import { PortalUpsert } from '../../data-portal/actions/portal.upsert';
import { FormService } from '../../../core/shared/form.service';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { PageUpdateAction } from '../../ui-page/actions/page-update-action';
import { PageActionEnum } from '../../../shared/enum/page-action.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { PortalEnum } from '../../../shared/enum/portal.enum';

@Injectable()
export class PageEffects extends EffectsAbstract<PortalModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: PortalPageService,
    protected modelService: PortalService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Perform API call to fetch agency details on page open event
   *
   * @action PageEventOpen
   */
  PageEventOpen2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => {

      // Not write page OR page linked to a specific ID
      if (action.payload.type !== PageTypeEnum.write || action.payload.id) {

        return [];
      }

      return concat(

        // Update action
        of(new PageUpdateAction({
          action: PageActionEnum.loading,
        })),

        // API call
        this
          .modelService
          .loadAgencyDetails()
          .pipe(

            // Success
            switchMap(agency => {

              const newModel = new PortalModel();

              newModel.agency = agency;

              return [

                // Update model
                new PageUpdateModel({ model: newModel }),

                // Update action
                new PageUpdateAction({
                  action: PageActionEnum.none,
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Broadcast error
              new RuntimeEventError({ id: '41', error: error }),

              // Update action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),
            ]),
          ),
      );
    })),
  );

  /**
   * Perform API call to fetch default configuration on portal change event
   *
   * @action PageEventChangeModel input.name === 'portalId'
   */
  PageEventChangeModel2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name === 'portalId'),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, pageModel]) => {

      // Portal ID not available OR it's not changed
      if (!action.payload.input.value || action.payload.input.value === pageModel.portalId) {

        return [];
      }

      return concat(

        // Update action
        of(new PageUpdateAction({
          action: PageActionEnum.loading,
        })),

        // API call
        this
          .modelService
          .loadDefaults(pageModel, <PortalEnum>action.payload.input.value)
          .pipe(

            // Success
            switchMap(model => [

              // Update model
              new PageUpdateModel({ model }),

              // Update action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),
            ]),

            // Error
            catchError(error => [

              // Broadcast error
              new RuntimeEventError({ id: '42', error: error }),

              // Update action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: PortalModel): Action {

    return new PortalUpsert({
      models: [model],
    });
  }
}
