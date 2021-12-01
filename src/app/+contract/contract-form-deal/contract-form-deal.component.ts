import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dictionary } from '../../shared/class/dictionary';

import { ContractModel } from '../../shared/model/contract.model';
import { ContractOptionsInterface } from '../../shared/interface/contract-options.interface';
import { ContractModelDealAdapterStrategy } from '../../core/shared/contract/contract-model-deal-adapter.strategy';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { ContactModel } from '../../shared/model/contact.model';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-contract-form-deal',
  templateUrl: './contract-form-deal.component.html',
  styleUrls: ['./contract-form-deal.component.scss'],
})
export class ContractFormDealComponent extends FormComponentAbstract<
  ContractModel,
  ContractOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: ContractModelDealAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Asking price changed from outside (async call on propertyId selection knows nothing about any form!)
    if (
      !!this.formGroup &&
      !!changes.model &&
      changes.model.previousValue &&
      changes.model.previousValue.askingPrice !== changes.model.currentValue.askingPrice
    ) {

      // Update form's asking price
      this.setValue('askingPrice', changes.model.currentValue.askingPrice);
    }
  }

  /**
   * @inheritDoc
   */
  onClickFormArrayAdd(path: string, parentContractCommissionId: string = ''): void {

    super.onClickFormArrayAdd(path);

    // Has parent
    if (parentContractCommissionId) {

      // Next cycle
      setTimeout(() => {

        // Set parent ID
        this.setValue(
          [path, this.getFormArray(path).control.controls.length - 1, 'parentContractCommissionId'].join('.'),
          parentContractCommissionId,
        );
      });
    }
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface, index: number): void {

    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = selection.text;

    this.setValue(['contractCommissions', index, 'contact'].join('.'), contact);
  }

  /**
   * @inheritDoc
   */
  protected validate(): Dictionary<string|null> {

    const error = this.modelAdapterStrategy.validate(this.model, this.error);

    // Price
    const isActivePricePercentage = this.formGroup.get('isActivePricePercentage').value;

    error.negotiatedPrice = isActivePricePercentage === false && !this.formGroup.get('negotiatedPrice').value ?
      'required' : null;

    error.negotiatedPricePercentage = isActivePricePercentage === true && !this.formGroup.get('negotiatedPricePercentage').value ?
      'required' : null;

    // Agency fee
    const isActiveAgencyFeePercentage = this.formGroup.get('isActiveAgencyFeePercentage').value;

    error.agencyFee = isActiveAgencyFeePercentage === false && !this.formGroup.get('agencyFee').value ?
      'required' : null;

    error.agencyFeePercentage = isActiveAgencyFeePercentage === true && !this.formGroup.get('agencyFeePercentage').value ?
      'required' : null;

    // Emit errors
    Object
      .keys(error)
      .forEach(key => this.emitError(key, error[key]));

    return error;
  }
}
