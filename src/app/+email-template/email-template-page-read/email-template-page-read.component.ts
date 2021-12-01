import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { EmailTemplatePageService } from '../../core/shared/email-template/email-template-page.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { EmailTemplateOptionsInterface } from '../../shared/interface/email-template-options.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

@Component({
  selector: 'app-email-template-page-read',
  templateUrl: './email-template-page-read.component.html',
  styleUrls: ['./email-template-page-read.component.scss'],
})
export class EmailTemplatePageReadComponent extends
  PageReadComponentAbstract<EmailTemplateModel, EmailTemplateOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.emailTemplateReadInformation;
  readonly PAGE_TAB_CONTENT: PageTabEnum = PageTabEnum.emailTemplateReadContent;

  /**
   * State observables
   */
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;
  currentLanguageLabel$: Observable<string>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: EmailTemplatePageService,
    protected activatedRoute: ActivatedRoute,
    protected runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.currentLanguageLabel$ = this.runtimeService.selectCurrentLanguageLabel();
    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
  }
}
