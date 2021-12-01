import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { TaskModel } from '../../shared/model/task.model';
import { TaskSearchOptionsInterface } from '../../shared/interface/task-search-options.interface';
import { TaskSearchModel } from '../../shared/model/task-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { TaskPageService } from '../../core/shared/task/task-page.service';
import { TaskSearchlistService } from '../../core/shared/task/task-searchlist.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-task-page-list',
  templateUrl: './task-page-list.component.html',
  styleUrls: ['./task-page-list.component.scss'],
})
export class TaskPageListComponent extends PageListComponentAbstract<
  TaskModel,
  TaskSearchModel,
  TaskSearchOptionsInterface
> {

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: TaskPageService,
    protected searchlistService: TaskSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimeFeature$ = this.runtimeService.selectFeature();
  }
}
