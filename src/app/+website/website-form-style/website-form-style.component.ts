import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { WebsiteModel } from '../../shared/model/website.model';
import { WebsiteModelStyleAdapterStrategy } from '../../core/shared/website/website-model-style-adapter.strategy';
import { WebsiteOptionsInterface } from '../../shared/interface/website-options.interface';

@Component({
  selector: 'app-website-form-style',
  templateUrl: './website-form-style.component.html',
  styleUrls: ['./website-form-style.component.scss'],
})
export class WebsiteFormStyleComponent extends FormComponentAbstract<
  WebsiteModel,
  WebsiteOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: WebsiteModelStyleAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Color picked from color picker
   */
  onPickColor(fieldName: string, color: string): void {

    this.setValue(fieldName, color);
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = {
      emitEvent: false,
    };

    if (this.isLoading || this.isDisabled) {

      return;
    }

    // Toggle fields
    this.model.isInternal ? this.formGroup.enable(options) : this.formGroup.disable(options);
  }
}
