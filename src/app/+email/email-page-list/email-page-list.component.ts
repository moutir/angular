import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmailModel } from '../../shared/model/email.model';
import { EmailSearchOptionsInterface } from '../../shared/interface/email-search-options.interface';
import { EmailSearchModel } from '../../shared/model/email-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { EmailSearchlistService } from '../../core/shared/email/email-searchlist.service';
import { EmailPageService } from '../../core/shared/email/email-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-email-page-list',
  templateUrl: './email-page-list.component.html',
  styleUrls: ['./email-page-list.component.scss'],
})
export class EmailPageListComponent extends PageListComponentAbstract<
  EmailModel,
  EmailSearchModel,
  EmailSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: EmailPageService,
    protected searchlistService: EmailSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }
}
