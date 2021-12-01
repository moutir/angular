import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { EmailTemplateSearchModel } from '../../shared/model/email-template-search.model';
import { EmailTemplateSearchOptionsInterface } from '../../shared/interface/email-template-search-options.interface';
import { EmailTemplateConfig } from '../../core/shared/email-template/email-template.config';
import { EmailTemplateSearchlistService } from '../../core/shared/email-template/email-template-searchlist.service';

@Component({
  selector: 'app-email-template-searchlist',
  templateUrl: './email-template-searchlist.component.html',
})
export class EmailTemplateSearchlistComponent extends SearchlistComponentAbstract<
  EmailTemplateModel,
  EmailTemplateSearchModel,
  EmailTemplateSearchOptionsInterface
> {

  /**
   * State observables
   */
  currentLanguageLabel$: Observable<string>;

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: EmailTemplateConfig,
    protected searchlistService: EmailTemplateSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.currentLanguageLabel$ = this.runtimeService.selectCurrentLanguageLabel();
  }

}
