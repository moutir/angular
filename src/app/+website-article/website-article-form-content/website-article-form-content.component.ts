import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WebsiteArticleModelContentAdapterStrategy } from '../../core/shared/website-article/website-article-model-content-adapter.strategy';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { WebsiteArticleOptionsInterface } from '../../shared/interface/website-article-options.interface';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';

@Component({
  selector: 'app-website-article-form-content',
  templateUrl: './website-article-form-content.component.html',
  styleUrls: ['./website-article-form-content.component.scss'],
})
export class WebsiteArticleFormContentComponent extends FormComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleOptionsInterface
> {

  /**
   * Email template content language
   */
  @Input() language: LanguageEnum;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: WebsiteArticleModelContentAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected build(): void {

    // Override model adapter strategy using current language
    this.modelAdapterStrategy = this.modelAdapterStrategy.clone(this.language);

    // Build form
    super.build();
  }

  /**
   * Return the language specific form control name
   */
  getFormControlName(field: string): string {

    return this.modelAdapterStrategy.getFieldUid(field);
  }

  /**
   * Changed value of WYSIWYG
   */
  onChangeWysiwyg(value: string): void {

    // Update form value
    this.setValue(this.getFormControlName('description'), value);
  }
}
