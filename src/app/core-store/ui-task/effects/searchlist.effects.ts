import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { TaskModel } from '../../../shared/model/task.model';
import { TaskUpsert } from '../../data-task/actions/task-upsert';
import { TaskSearchlistService } from '../../../core/shared/task/task-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { TaskSearchModel } from '../../../shared/model/task-search.model';
import { TaskSearchOptionsInterface } from '../../../shared/interface/task-search-options.interface';
import { TaskService } from '../../../core/shared/task/task.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  TaskModel,
  TaskSearchModel,
  TaskSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: TaskService,
    protected searchlistService: TaskSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: TaskModel[]): TaskUpsert {

    return new TaskUpsert({
      models: models,
    });
  }
}
