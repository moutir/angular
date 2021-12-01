import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ReportingConfig } from './reporting.config';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ReportingService } from './reporting.service';

@Injectable()
export class ReportingPageService extends PageServiceAbstract<ReportingModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ReportingConfig,
    protected modelService: ReportingService,
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
