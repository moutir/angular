import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SectorSearchOptionsInterface } from '../../shared/interface/sector-search-options.interface';
import { SectorSearchModel } from '../../shared/model/sector-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-sector-form-search',
  templateUrl: './sector-form-search.component.html',
  styleUrls: ['./sector-form-search.component.scss'],
})
export class SectorFormSearchComponent extends FormComponentAbstract<
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<SectorSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
