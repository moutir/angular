import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ProductionService } from '../../../core/shared/production/production.service';
import { ProductionPageService } from '../../../core/shared/production/production-page.service';
import { ProductionModel } from '../../../shared/model/production.model';
import { ProductionOptionsInterface } from '../../../shared/interface/production-options.interface';
import { FormService } from '../../../core/shared/form.service';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { ProductionTypeEnum } from '../../../shared/enum/production-type.enum';

@Injectable()
export class PageEffects extends EffectsAbstract<ProductionModel, ProductionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ProductionPageService,
    protected modelService: ProductionService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Update contacts for specific date
   *
   * @action PageEventChangeModel
   */
  PageEventChangeModelDate$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.input.name.toLowerCase().indexOf('date') > -1),
    switchMap(action => zip(
      of(action),
      this.modelService.selectByFrequency(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, byFrequency, model]) => {

      const pageModel = action.payload.model.clone<ProductionModel>();
      const type = <ProductionTypeEnum>action.payload.input.name.split('_')[2];

      pageModel.contactsByType[type] = this.modelService.getContactsByFrequency(type, byFrequency, pageModel);

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
  protected getUpsertAction(model: ProductionModel): Action {

    return null;
  }
}
