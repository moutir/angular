import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { TaskModel } from '../../shared/model/task.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { TaskPageService } from '../../core/shared/task/task-page.service';
import { TaskOptionsInterface } from '../../shared/interface/task-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { TaskModelGeneralAdapterStrategy } from '../../core/shared/task/task-model-general-adapter.strategy';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-task-page-write',
  templateUrl: './task-page-write.component.html',
})
export class TaskPageWriteComponent extends PageWriteComponentAbstract<
  TaskModel,
  TaskOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.taskWriteGeneral;

  /**
   * State observables
   */
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  featureTask$: Observable<RuntimeFeatureTaskInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: TaskPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
    private runtimeService: RuntimeService,
    private generalModelAdapterStrategy: TaskModelGeneralAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    super.ngOnInit();

    this.pageService
      .selectModel()
      .pipe(take(1))
      .subscribe(model => {

        if (model.id) {

          // Stats
          this.trackerService.trackString(TrackingActionEnum.taskView, model.id);
        }
      });

    // Set entities from query params
    this.pageService.entitiesFromRoute(this.activatedRoute.snapshot.queryParams);
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new TaskModel();

    // Set up general tab fields
    Object
      .keys(this.generalModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.taskWriteGeneral);

    return fieldTabMapping;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.featureTask$ = this.runtimeService.selectFeatureTask();
  }
}
