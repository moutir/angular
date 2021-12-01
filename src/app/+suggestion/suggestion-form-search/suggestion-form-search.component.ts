import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SuggestionSearchOptionsInterface } from '../../shared/interface/suggestion-search-options.interface';
import { SuggestionSearchModel } from '../../shared/model/suggestion-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-suggestion-form-search',
  templateUrl: './suggestion-form-search.component.html',
  styleUrls: ['./suggestion-form-search.component.scss'],
})
export class SuggestionFormSearchComponent extends FormComponentAbstract<
  SuggestionSearchModel,
  SuggestionSearchOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<SuggestionSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
