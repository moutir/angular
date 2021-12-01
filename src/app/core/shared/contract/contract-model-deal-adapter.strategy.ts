import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { ContractModel } from '../../../shared/model/contract.model';
import { ContractCommissionModel } from '../../../shared/model/contract-commission.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { requiredModelValidator } from '../../../shared/validator/required-model.validator';
import { ContactModel } from '../../../shared/model/contact.model';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class ContractModelDealAdapterStrategy extends FormModelAdapterStrategy<ContractModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: ContractModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      askingPrice: {
        value: model.askingPrice,
        validators: [],
      },
      negotiatedPrice: {
        value: model.negotiatedPrice,
        validators: [],
      },
      negotiatedPricePercentage: {
        value: model.negotiatedPricePercentage,
        validators: [Validators.min(0), Validators.max(100)],
      },
      depositAmount: {
        value: model.depositAmount,
        validators: [],
      },
      depositAmountPercentage: {
        value: model.depositAmountPercentage,
        validators: [Validators.min(0), Validators.max(100)],
      },
      agencyFee: {
        value: model.agencyFee,
        validators: [],
      },
      agencyFeePercentage: {
        value: model.agencyFeePercentage,
        validators: [Validators.min(0), Validators.max(100)],
      },
      agencyFeeVatExcluded: {
        value: model.agencyFeeVatExcluded,
        validators: [],
      },
      agencyVat: {
        value: model.agencyVat,
        validators: [],
      },
      isActivePricePercentage: {
        value: model.isActivePricePercentage,
        validators: [],
        updateOn: 'change',
      },
      isActiveAgencyFeePercentage: {
        value: model.isActiveAgencyFeePercentage,
        validators: [],
        updateOn: 'change',
      },
      totalCommission: {
        value: model.totalCommission,
        validators: [],
      },
      fundAmountPersonal: {
        value: model.fundAmountPersonal,
        validators: [],
      },
      fundAmountMortgage: {
        value: model.fundAmountMortgage,
        validators: [],
      },
      fundConditionPrecedentDate: {
        value: model.fundConditionPrecedentDate,
        validators: [],
      },
      fundAcceptDate: {
        value: model.fundAcceptDate,
        validators: [],
      },
      contractCommissions: {
        value: model.contractCommissions.map(contractCommissionModel => {

          return {
            typeId: contractCommissionModel.typeId,
            contact: contractCommissionModel.contact,
            amount: contractCommissionModel.amount,
            invoice: contractCommissionModel.invoice,
            comment: contractCommissionModel.comment,
            parentContractCommissionId: contractCommissionModel.parentContractCommissionId,
            isRemoved: contractCommissionModel.isRemoved,
          };
        }),
        validators: [],
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
          amount: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required)],
          },
          invoice: {
            value: '',
            validators: [],
          },
          comment: {
            value: '',
            validators: [],
          },
          parentContractCommissionId: {
            value: '',
            validators: [],
          },
          order: {
            value: '',
            validators: [],
          },
        },
      },
    };
  }

  /**
   * @inheritDoc
   */
  validate(model: ContractModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};

    error.totalCommission = model.totalCommission > model.agencyFeeVatExcluded ? 'form_error_contract_commission_sum' : null;

    return error;
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: ContractModel,
    formGroup: FormGroup,
    key: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): ContractModel {

    const newModel = model.clone<ContractModel>();

    // Commissions
    if (key === 'contractCommissions') {

      newModel.contractCommissions = this.getModelCommissions(newModel, (value as Object[]));

      return newModel;
    }

    // Other attributes
    newModel[key] = value;

    if (key === 'negotiatedPrice') {

      newModel.negotiatedPricePercentage = this.getPercentageFromValue(String(model.askingPrice || 0), String(value));
    }

    if (key === 'negotiatedPricePercentage') {

      newModel.negotiatedPrice = this.getValueFromPercentage(String(model.askingPrice || 0), <string>value);
    }

    if (key === 'depositAmount') {

      newModel.depositAmountPercentage = this.getPercentageFromValue(String(model.negotiatedPrice || 0), String(value));
    }

    if (key === 'depositAmountPercentage') {

      newModel.depositAmount = this.getValueFromPercentage(String(model.negotiatedPrice || 0), <string>value);
    }

    if (key === 'agencyFee') {

      newModel.agencyFeePercentage = this.getPercentageFromValue(String(model.negotiatedPrice || 0), String(value));
    }

    if (key === 'agencyFeePercentage') {

      newModel.agencyFee = this.getValueFromPercentage(String(model.negotiatedPrice || 0), <string>value);
    }

    // Asking price or negotiated price changed
    if (key === 'askingPrice' || key === 'negotiatedPrice' || key === 'negotiatedPricePercentage') {

      // Price percentage mode
      if (model.isActivePricePercentage === true) {

        if (key === 'askingPrice') {

          newModel.negotiatedPrice = this.getValueFromPercentage(
            String(model.askingPrice || 0),
            String(newModel.negotiatedPricePercentage),
          );
        }

        newModel.depositAmount = this.getValueFromPercentage(
          String(newModel.negotiatedPrice || 0),
          String(newModel.depositAmountPercentage),
        );
      }

      // Agency fee percentage
      if (model.isActiveAgencyFeePercentage === true) {

        newModel.agencyFee = this.getValueFromPercentage(
          String(newModel.negotiatedPrice || 0),
          String(newModel.agencyFeePercentage),
        );
      }
    }

    // Always update agency fee VAT excluded
    newModel.agencyFeeVatExcluded = (newModel.agencyFee - this.getValueFromPercentage(
      String(newModel.agencyFee),
      String(newModel.agencyVat),
    )) || 0;

    return newModel;
  }

  /**
   * Returns a value from a percentage
   */
  private getValueFromPercentage(value: string, percentage: string): number {

    return parseFloat(value) * parseFloat(percentage) / 100.0;
  }

  /**
   * Returns a percentage from a value
   */
  private getPercentageFromValue(fullValue: string, partialValue: string): number {

    return parseFloat(partialValue) / parseFloat(fullValue) * 100.0;
  }

  /**
   * Returns commission models for model
   */
  private getModelCommissions(newModel: ContractModel, commissions: Object[]): ContractCommissionModel[] {

    // Contract commission removed state
    const isRemoved: KeyValueType<string, boolean> = {};

    newModel.totalCommission = 0;

    return (commissions || []).map((commission, i) => {

      const contractCommissionModel = newModel.contractCommissions[i] ?
        newModel.contractCommissions[i].clone<ContractCommissionModel>() : new ContractCommissionModel();

      // Is new
      contractCommissionModel.isNew = contractCommissionModel.isNew || !contractCommissionModel.id;

      // Attributes
      contractCommissionModel.id = contractCommissionModel.id || 'temp-' + i;
      contractCommissionModel.typeId = commission['typeId'];
      contractCommissionModel.contact = commission['contact'];
      contractCommissionModel.amount = commission['amount'];
      contractCommissionModel.invoice = commission['invoice'];
      contractCommissionModel.comment = commission['comment'];
      contractCommissionModel.parentContractCommissionId = commission['parentContractCommissionId'];

      // Is removed
      contractCommissionModel.isRemoved = commission['parentContractCommissionId'] && isRemoved[commission['parentContractCommissionId']]
                                       || commission['isRemoved'];
      isRemoved[contractCommissionModel.id] = contractCommissionModel.isRemoved;

      if (!contractCommissionModel.isRemoved) {

        // Update total commission
        newModel.totalCommission += Number(contractCommissionModel.amount) * (contractCommissionModel.parentContractCommissionId ? -1 : 1);
      }

      return contractCommissionModel;
    });
  }
}
