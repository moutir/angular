import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { EmailTemplateModelRequiredAdapterStrategy } from '../../core/shared/email-template/email-template-model-required-adapter.strategy';
import { EmailTemplateOptionsInterface } from '../../shared/interface/email-template-options.interface';

@Component({
  selector: 'app-email-template-form-required',
  templateUrl: './email-template-form-required.component.html',
  styleUrls: ['./email-template-form-required.component.scss'],
})
export class EmailTemplateFormRequiredComponent extends FormComponentAbstract<
  EmailTemplateModel,
  EmailTemplateOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: EmailTemplateModelRequiredAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
