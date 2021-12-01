import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingGroupPageService } from '../../../core/shared/matching-group/matching-group-page.service';
import { MatchingGroupService } from '../../../core/shared/matching-group/matching-group.service';
import { MatchingGroupUpsert } from '../../data-matching-group/actions/matching-group-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<MatchingGroupModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: MatchingGroupPageService,
    protected modelService: MatchingGroupService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: MatchingGroupModel): Action {

    return new MatchingGroupUpsert({
      models: [model],
    });
  }
}
