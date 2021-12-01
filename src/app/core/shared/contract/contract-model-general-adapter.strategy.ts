import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { ContractModel } from '../../../shared/model/contract.model';
import { ContractContactModel } from '../../../shared/model/contract-contact.model';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { arrayMinLengthValidator } from '../../../shared/validator/array-min-length.validator';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { ContactModel } from '../../../shared/model/contact.model';
import { requiredModelValidator } from '../../../shared/validator/required-model.validator';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';

@Injectable()
export class ContractModelGeneralAdapterStrategy extends FormModelAdapterStrategy<ContractModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    contractContacts: {
      factory: (): ModelAbstract => new ContractContactModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: ContractModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      propertyId: {
        value: model.property.id,
        validators: [Validators.required],
      },
      reference: {
        value: model.reference,
        validators: [Validators.required],
      },
      stepId: {
        value: model.stepId,
        validators: [Validators.required],
      },
      sellTypeId: {
        value: model.sellTypeId,
        validators: [Validators.required],
      },
      projectDate: {
        value: model.projectDate,
        validators: [],
      },
      offerDate: {
        value: model.offerDate,
        validators: [],
      },
      agreementDate: {
        value: model.agreementDate,
        validators: [],
      },
      coolingOffEndDate: {
        value: model.coolingOffEndDate,
        validators: [],
      },
      conditionPrecedentDate: {
        value: model.conditionPrecedentDate,
        validators: [],
      },
      scheduleDate: {
        value: model.scheduleDate,
        validators: [],
      },
      contractDate: {
        value: model.contractDate,
        validators: [],
      },
      billingDate: {
        value: model.billingDate,
        validators: [],
      },
      signDate: {
        value: model.signDate,
        validators: [],
      },
      collectionDate: {
        value: model.collectionDate,
        validators: [],
      },
      cancelDate: {
        value: model.cancelDate,
        validators: [],
      },
      comment: {
        value: model.comment,
        validators: [],
      },
      contractContacts: {
        value: model.contractContacts.map(contractContactModel => {

          return {
            isRemoved: contractContactModel.isRemoved,
            typeId: contractContactModel.typeId,
            contact: contractContactModel.contact,
            comment: contractContactModel.comment,
          };
        }),
        validators: [arrayMinLengthValidator(3)],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          typeId: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          contact: {
            value: new ContactModel(),
            validators: [ifIsNotRemoved(requiredModelValidator)],
          },
          comment: {
            value: '',
            validators: [],
          },
        },
      },
    };
  }
}
