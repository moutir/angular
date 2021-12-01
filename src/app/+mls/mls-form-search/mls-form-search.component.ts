import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MlsSearchOptionsInterface } from '../../shared/interface/mls-search-options.interface';
import { MlsSearchModel } from '../../shared/model/mls-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';

@Component({
  selector: 'app-mls-form-search',
  templateUrl: './mls-form-search.component.html',
  styleUrls: ['./mls-form-search.component.scss'],
})
export class MlsFormSearchComponent extends FormComponentAbstract<
  MlsSearchModel,
  MlsSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_MLS: EntityEnum[] = [EntityEnum.mls];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<MlsSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete partner agency selection
   */
  onChangeSelectionPartner(selection: AutocompleteSelectionInterface): void {

    return this.setValue('partnerAgencyId', selection.id);
  }
}
