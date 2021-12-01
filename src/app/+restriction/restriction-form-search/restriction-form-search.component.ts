import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RestrictionSearchOptionsInterface } from '../../shared/interface/restriction-search-options.interface';
import { RestrictionSearchModel } from '../../shared/model/restriction-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-restriction-form-search',
  templateUrl: './restriction-form-search.component.html',
  styleUrls: ['./restriction-form-search.component.scss'],
})
export class RestrictionFormSearchComponent extends FormComponentAbstract<
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<RestrictionSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
