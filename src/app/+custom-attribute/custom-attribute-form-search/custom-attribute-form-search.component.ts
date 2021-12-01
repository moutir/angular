import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CustomAttributeSearchOptionsInterface } from '../../shared/interface/custom-attribute-search-options.interface';
import { CustomAttributeSearchModel } from '../../shared/model/custom-attribute-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-custom-attribute-form-search',
  templateUrl: './custom-attribute-form-search.component.html',
  styleUrls: ['./custom-attribute-form-search.component.scss'],
})
export class CustomAttributeFormSearchComponent extends FormComponentAbstract<
  CustomAttributeSearchModel,
  CustomAttributeSearchOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<CustomAttributeSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
