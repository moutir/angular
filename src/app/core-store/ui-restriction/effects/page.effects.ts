import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { RestrictionService } from '../../../core/shared/restriction/restriction.service';
import { RestrictionPageService } from '../../../core/shared/restriction/restriction-page.service';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { RestrictionOptionsInterface } from '../../../shared/interface/restriction-options.interface';
import { RestrictionUpsert } from '../../data-restriction/actions/restriction-upsert';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { FormService } from '../../../core/shared/form.service';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { RestrictionEventRemove } from '../actions/restriction-event-remove';

@Injectable()
export class PageEffects extends EffectsAbstract<RestrictionModel, RestrictionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: RestrictionPageService,
    protected modelService: RestrictionService,
    protected propertySearchlistService: PropertySearchlistService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

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

      // Remove
      if (action.payload.menuItem.id === 'remove') {

        return of(
          new RestrictionEventRemove({ id: model.id }),
        );
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: RestrictionModel): Action {

    return new RestrictionUpsert({
      models: [model],
    });
  }
}
