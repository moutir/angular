import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { EmailingModelContentAdapterStrategy } from '../../core/shared/emailing/emailing-model-content-adapter.strategy';
import { EmailingOptionsInterface } from '../../shared/interface/emailing-options.interface';
import { EmailingModel } from '../../shared/model/emailing.model';

@Component({
  selector: 'app-emailing-form-content',
  templateUrl: './emailing-form-content.component.html',
  styleUrls: ['./emailing-form-content.component.scss'],
})
export class EmailingFormContentComponent extends FormComponentAbstract<
  EmailingModel,
  EmailingOptionsInterface
> {

  /**
   * Email content language
   */
  @Input() language: LanguageEnum;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: EmailingModelContentAdapterStrategy,
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
