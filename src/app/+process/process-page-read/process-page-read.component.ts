import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProcessModel } from '../../shared/model/process.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { ProcessPageService } from '../../core/shared/process/process-page.service';

@Component({
  selector: 'app-process-page-read',
  templateUrl: './process-page-read.component.html',
  styleUrls: ['./process-page-read.component.scss'],
})
export class ProcessPageReadComponent extends PageReadComponentAbstract<ProcessModel, {}> implements OnInit {

  /**
   * Constructor
   */
  constructor(
    protected pageService: ProcessPageService,
    protected activatedRoute: ActivatedRoute,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }
}
