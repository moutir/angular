import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { TaskModel } from '../../shared/model/task.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { TaskPageService } from '../../core/shared/task/task-page.service';
import { TaskOptionsInterface } from '../../shared/interface/task-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-task-page-read',
  templateUrl: './task-page-read.component.html',
  styleUrls: ['./task-page-read.component.scss'],
})
export class TaskPageReadComponent extends PageReadComponentAbstract<
  TaskModel,
  TaskOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.taskReadGeneral;
  readonly PERMISSION_AGENDA_READ: PermissionEnum = PermissionEnum.agendaRead;

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
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    super.ngOnInit();

    if (this.model.id) {

      // Stats
      this.trackerService.trackString(TrackingActionEnum.taskView, this.model.id);
    }
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
