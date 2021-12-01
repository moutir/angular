import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { EmailTemplateSearchModel } from '../../shared/model/email-template-search.model';
import { EmailTemplatePageService } from '../../core/shared/email-template/email-template-page.service';
import { EmailTemplateSearchlistService } from '../../core/shared/email-template/email-template-searchlist.service';
import { EmailTemplateOptionsInterface } from '../../shared/interface/email-template-options.interface';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-email-template-page-list',
  templateUrl: './email-template-page-list.component.html',
})
export class EmailTemplatePageListComponent extends
  PageListComponentAbstract<EmailTemplateModel, EmailTemplateSearchModel, EmailTemplateOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: EmailTemplatePageService,
    protected searchlistService: EmailTemplateSearchlistService,
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
