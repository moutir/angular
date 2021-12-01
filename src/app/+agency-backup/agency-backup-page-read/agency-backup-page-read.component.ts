import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { AgencyBackupPageService } from '../../core/shared/agency-backup/agency-backup-page.service';
import { AgencyBackupModel } from '../../shared/model/agency-backup.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-agency-backup-page-read',
  templateUrl: './agency-backup-page-read.component.html',
  styleUrls: ['./agency-backup-page-read.component.scss'],
})
export class AgencyBackupPageReadComponent extends PageReadComponentAbstract<AgencyBackupModel, {}> {

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgencyBackupPageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Set state observables
    this.runtimeFeature$ = this.runtimeService.selectFeature();
  }
}
