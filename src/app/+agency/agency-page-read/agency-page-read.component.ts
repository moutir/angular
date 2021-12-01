import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AgencyModel } from '../../shared/model/agency.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { AgencyPageService } from '../../core/shared/agency/agency-page.service';
import { AgencyOptionsInterface } from '../../shared/interface/agency-options.interface';

@Component({
  selector: 'app-agency-page-read',
  templateUrl: './agency-page-read.component.html',
  styleUrls: ['./agency-page-read.component.scss'],
})
export class AgencyPageReadComponent extends PageReadComponentAbstract<AgencyModel, AgencyOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: AgencyPageService,
    protected activatedRoute: ActivatedRoute,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }
}
