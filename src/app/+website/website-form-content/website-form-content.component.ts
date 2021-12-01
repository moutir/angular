import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { WebsiteModelContentAdapterStrategy } from '../../core/shared/website/website-model-content-adapter.strategy';
import { WebsiteOptionsInterface } from '../../shared/interface/website-options.interface';
import { WebsiteModel } from '../../shared/model/website.model';

@Component({
  selector: 'app-website-form-content',
  templateUrl: './website-form-content.component.html',
  styleUrls: ['./website-form-content.component.scss'],
})
export class WebsiteFormContentComponent extends FormComponentAbstract<
  WebsiteModel,
  WebsiteOptionsInterface
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
    protected modelAdapterStrategy: WebsiteModelContentAdapterStrategy,
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
