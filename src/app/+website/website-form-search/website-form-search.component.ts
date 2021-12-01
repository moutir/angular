import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WebsiteSearchOptionsInterface } from '../../shared/interface/website-search-options.interface';
import { WebsiteSearchModel } from '../../shared/model/website-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-website-form-search',
  templateUrl: './website-form-search.component.html',
  styleUrls: ['./website-form-search.component.scss'],
})
export class WebsiteFormSearchComponent extends FormComponentAbstract<
  WebsiteSearchModel,
  WebsiteSearchOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<WebsiteSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
