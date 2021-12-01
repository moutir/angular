import { Component, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { MlsModel } from '../../shared/model/mls.model';
import { MlsOptionsInterface } from '../../shared/interface/mls-options.interface';
import { MlsModelAdapterStrategy } from '../../core/shared/mls/mls-model-adapter.strategy';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';

@Component({
  selector: 'app-mls-form-required',
  templateUrl: './mls-form-required.component.html',
})
export class MlsFormRequiredComponent extends FormComponentAbstract<
  MlsModel,
  MlsOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_MLS: EntityEnum[] = [EntityEnum.mls];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: MlsModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed query on autocomplete mls
   */
  onChangeQueryPartner(query: string): void {

    if (query !== '') {

      return;
    }

    return this.setValue('partnerAgencyId', null);
  }

  /**
   * Changed autocomplete partner agency selection
   */
  onChangeSelectionPartner(selection: AutocompleteSelectionInterface): void {

    return this.setValue('partnerAgencyId', selection.id);
  }
}
