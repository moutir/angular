import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ReportModel } from '../../../shared/model/report.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ReportConfig } from './report.config';
import { ReportService } from './report.service';

@Injectable()
export class ReportPageService extends PageServiceAbstract<ReportModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ReportConfig,
    protected modelService: ReportService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }
}
