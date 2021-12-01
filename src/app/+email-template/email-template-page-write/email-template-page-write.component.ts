import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { EmailTemplatePageService } from '../../core/shared/email-template/email-template-page.service';
import { EmailTemplateModelContentAdapterStrategy } from '../../core/shared/email-template/email-template-model-content-adapter.strategy';
import { EmailTemplateModelRequiredAdapterStrategy } from '../../core/shared/email-template/email-template-model-required-adapter.strategy';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { EmailTemplateContentModel } from '../../shared/model/email-template-content.model';
import { EmailTemplateOptionsInterface } from '../../shared/interface/email-template-options.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { Dictionary } from '../../shared/class/dictionary';

@Component({
  selector: 'app-email-template-page-write',
  templateUrl: './email-template-page-write.component.html',
  styleUrls: ['./email-template-page-write.component.scss'],
})
export class EmailTemplatePageWriteComponent extends PageWriteComponentAbstract<
  EmailTemplateModel,
  EmailTemplateOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_REQUIRED: PageTabEnum = PageTabEnum.emailTemplateWriteRequired;
  readonly PAGE_TAB_CONTENT: PageTabEnum = PageTabEnum.emailTemplateWriteContent;

  /**
   * State observables
   */
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: EmailTemplatePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private requiredModelAdapterStrategy: EmailTemplateModelRequiredAdapterStrategy,
    private contentModelAdapterStrategy: EmailTemplateModelContentAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * Return the tab UID for a write-content tab in the given language
   */
  getWriteContentTabUid(language: LanguageEnum): PageTabEnum {

    return this.pageService.getWriteContentTabUid(language);
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new EmailTemplateModel();

    // Set up required tab fields
    Object
      .keys(this.requiredModelAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.emailTemplateWriteRequired);

    // Set up language tab fields
    this.subscriptions.push(
      this
        .runtimeService
        .selectAvailableLanguageIds()
        .pipe(take(1))
        .subscribe(availableLanguageIds => {

          availableLanguageIds.forEach(languageId => {

            this.contentModelAdapterStrategy.setLanguage(languageId);

            model.content[languageId] = new EmailTemplateContentModel();

            Object
              .keys(this.contentModelAdapterStrategy.getFormControlConfig(model))
              .forEach((controlName) => fieldTabMapping[controlName] = this.getWriteContentTabUid(languageId));
          });
        }),
    );

    return fieldTabMapping;
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.availableLanguages$ = this.runtimeService.selectAvailableLanguages();
    this.availableLanguageIds$ = this.runtimeService.selectAvailableLanguageIds();
  }
}
