import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ProcessModel } from '../../shared/model/process.model';
import { ProcessSearchOptionsInterface } from '../../shared/interface/process-search-options.interface';
import { ProcessSearchModel } from '../../shared/model/process-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { ProcessSearchlistService } from '../../core/shared/process/process-searchlist.service';
import { ProcessConfig } from '../../core/shared/process/process.config';

@Component({
  selector: 'app-process-searchlist',
  templateUrl: './process-searchlist.component.html',
  styleUrls: ['./process-searchlist.component.scss'],
})
export class ProcessSearchlistComponent extends SearchlistComponentAbstract<
  ProcessModel,
  ProcessSearchModel,
  ProcessSearchOptionsInterface
> {

  /**
   * Display agency field
   */
  @Input() isDisplayedAgency: boolean = false;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ProcessConfig,
    protected searchlistService: ProcessSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
