import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AccountSearchOptionsInterface } from '../../shared/interface/account-search-options.interface';
import { AccountSearchModel } from '../../shared/model/account-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-account-form-search',
  templateUrl: './account-form-search.component.html',
  styleUrls: ['./account-form-search.component.scss'],
})
export class AccountFormSearchComponent extends FormComponentAbstract<
  AccountSearchModel,
  AccountSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<AccountSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    this.setValue('contactId', selection.id);
  }
}
