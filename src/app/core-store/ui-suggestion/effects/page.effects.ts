import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { SuggestionService } from '../../../core/shared/suggestion/suggestion.service';
import { SuggestionPageService } from '../../../core/shared/suggestion/suggestion-page.service';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { SuggestionOptionsInterface } from '../../../shared/interface/suggestion-options.interface';
import { SuggestionUpsert } from '../../data-suggestion/actions/suggestion-upsert';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { FormService } from '../../../core/shared/form.service';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { SuggestionEventRemove } from '../actions/suggestion-event-remove';

@Injectable()
export class PageEffects extends EffectsAbstract<SuggestionModel, SuggestionOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: SuggestionPageService,
    protected modelService: SuggestionService,
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
          new SuggestionEventRemove({ id: model.id }),
        );
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: SuggestionModel): Action {

    return new SuggestionUpsert({
      models: [model],
    });
  }
}
