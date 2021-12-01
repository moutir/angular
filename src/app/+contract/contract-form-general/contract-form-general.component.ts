import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { ContractModel } from '../../shared/model/contract.model';
import { ContractOptionsInterface } from '../../shared/interface/contract-options.interface';
import { ContractModelGeneralAdapterStrategy } from '../../core/shared/contract/contract-model-general-adapter.strategy';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { ContactModel } from '../../shared/model/contact.model';

@Component({
  selector: 'app-contract-form-general',
  templateUrl: './contract-form-general.component.html',
  styleUrls: ['./contract-form-general.component.scss'],
})
export class ContractFormGeneralComponent extends FormComponentAbstract<
  ContractModel,
  ContractOptionsInterface
> implements OnDestroy {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: ContractModelGeneralAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected initialize(): boolean {

    if (super.initialize() === false) {

      return false;
    }

    // New contract
    if (!this.model.id) {

      const formArrayConfig = this.modelAdapterStrategy.getFormControlConfig(this.model)['contractContacts'].formArrayConfig;

      // Add control to form array
      formArrayConfig.typeId.value = 'owner_broker';
      this.addFormArrayChild(this.formArray['contractContacts'].control, 'contractContacts', 0, formArrayConfig);

      // Add control to form array
      formArrayConfig.typeId.value = 'owner';
      this.addFormArrayChild(this.formArray['contractContacts'].control, 'contractContacts', 1, formArrayConfig);

      // Add control to form array
      formArrayConfig.typeId.value = 'customer';
      this.addFormArrayChild(this.formArray['contractContacts'].control, 'contractContacts', 2, formArrayConfig);
    }

    return true;
  }

  /**
   * Changed selection autocomplete property
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    this.setValue('propertyId', selection.id);
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface, index: number): void {

    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = selection.text;

    this.setValue(['contractContacts', index, 'contact'].join('.'), contact);
  }
}
