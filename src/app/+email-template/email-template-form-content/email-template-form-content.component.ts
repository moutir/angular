import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { EmailTemplateModelContentAdapterStrategy } from '../../core/shared/email-template/email-template-model-content-adapter.strategy';
import { EmailTemplateOptionsInterface } from '../../shared/interface/email-template-options.interface';
import { EmailTemplateModel } from '../../shared/model/email-template.model';

@Component({
  selector: 'app-email-template-form-content',
  templateUrl: './email-template-form-content.component.html',
  styleUrls: ['./email-template-form-content.component.scss'],
})
export class EmailTemplateFormContentComponent extends FormComponentAbstract<
  EmailTemplateModel,
  EmailTemplateOptionsInterface
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
    protected modelAdapterStrategy: EmailTemplateModelContentAdapterStrategy,
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
    this.setValue(this.getFormControlName('message'), value);
  }
}
