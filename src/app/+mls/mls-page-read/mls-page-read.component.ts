import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { MlsPageService } from '../../core/shared/mls/mls-page.service';
import { MlsModel } from '../../shared/model/mls.model';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { MlsOptionsInterface } from '../../shared/interface/mls-options.interface';

@Component({
  selector: 'app-mls-page-read',
  templateUrl: './mls-page-read.component.html',
  styleUrls: ['./mls-page-read.component.scss'],
})
export class MlsPageReadComponent extends PageReadComponentAbstract<MlsModel, MlsOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: MlsPageService,
    protected activatedRoute: ActivatedRoute,
    protected runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }
}
