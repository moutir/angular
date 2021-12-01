import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { WebsiteArticleModelContentAdapterStrategy } from '../../core/shared/website-article/website-article-model-content-adapter.strategy';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { WebsiteArticlePageService } from '../../core/shared/website-article/website-article-page.service';
import { WebsiteArticleOptionsInterface } from '../../shared/interface/website-article-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { KeyValueType } from '../../shared/type/key-value.type';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WebsiteContentModel } from '../../shared/model/website-content.model';

@Component({
  selector: 'app-website-article-page-write',
  templateUrl: './website-article-page-write.component.html',
  styleUrls: ['./website-article-page-write.component.scss'],
})
export class WebsiteArticlePageWriteComponent extends PageWriteComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleOptionsInterface
> {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.websiteArticleWriteGeneral;

  /**
   * State observables
   */
  availableLanguages$: Observable<KeyValueType<LanguageEnum, string>>;
  availableLanguageIds$: Observable<LanguageEnum[]>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsiteArticlePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private contentModelAdapterStrategy: WebsiteArticleModelContentAdapterStrategy,
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
    const model = new WebsiteArticleModel();

    // Set all model's attribute into general tab
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.websiteArticleWriteGeneral);

    // Set up language tab fields
    this.subscriptions.push(
      this
        .runtimeService
        .selectAvailableLanguageIds()
        .pipe(take(2))
        .subscribe(availableLanguageIds => {

          availableLanguageIds.forEach(languageId => {

            this.contentModelAdapterStrategy.setLanguage(languageId);

            model.content[languageId] = new WebsiteContentModel();

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
