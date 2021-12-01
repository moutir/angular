import { FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { AccountModel } from '../../../shared/model/account.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { Dictionary } from '../../../shared/class/dictionary';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { requiredModelValidator } from '../../../shared/validator/required-model.validator';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { AccountSwitchModel } from '../../../shared/model/account-switch.model';

@Injectable()
export class AccountModelAdapterStrategy extends FormModelAdapterStrategy<AccountModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    accountSwitches: {
      factory: (): ModelAbstract => new AccountSwitchModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: AccountModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      agencyId: {
        value: model.contact.agency.id,
        validators: [Validators.required],
      },
      firstName: {
        value: model.contact.firstName,
        validators: [Validators.required],
      },
      lastName: {
        value: model.contact.lastName,
        validators: [Validators.required],
      },
      accountTypeId: {
        value: model.accountType.value,
        validators: [Validators.required],
      },
      privileges: {
        value: model.privileges,
        validators: [],
      },
      login: {
        value: model.login,
        validators: [Validators.required, Validators.email],
      },
      password: {
        value: model.password,
        validators: [Validators.minLength(8)],
      },
      passwordConfirm: {
        value: model.passwordConfirm,
        validators: [Validators.minLength(8)],
      },
      expiryDate: {
        value: model.expiryDate,
        validators: [],
      },
      notes: {
        value: model.notes,
        validators: [],
      },
      languageId: {
        value: model.language.value,
        validators: [Validators.required],
      },
      isAllowedSwitching: {
        value: model.isAllowedSwitching,
        validators: [],
        updateOn: 'change',
      },
      isEnabledSendEmailOnBehalf: {
        value: model.isEnabledSendEmailOnBehalf,
        validators: [],
        updateOn: 'change',
      },
      isEnabledGoogleAgenda: {
        value: model.isEnabledGoogleAgenda,
        validators: [],
        updateOn: 'change',
      },
      isActive: {
        value: model.isActive,
        validators: [],
        updateOn: 'change',
      },
      accountSwitches: {
        value: model.accountSwitches.map(accountSwitchModel => {

          return {
            isRemoved: accountSwitchModel.isRemoved,
            account: accountSwitchModel.account,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          account: {
            value: new AccountModel(),
            validators: [ifIsNotRemoved(requiredModelValidator)],
          },
        },
      },
    };
  }

  /**
   * @inheritDoc
   */
  validate(model: AccountModel, currentError: Dictionary<string|null>): null|Dictionary<string|null> {

    const error: Dictionary<string> = {};

    // Adding account
    if (!model.id) {

      // Required
      error.password = model.password === '' ? 'form_error_required' : (currentError.password || null);
      error.passwordConfirm = model.passwordConfirm === '' ? 'form_error_required' : (currentError.password || null);

      if (model.password === '' || model.passwordConfirm === '') {

        return error;
      }
    }

    if (model.password === model.passwordConfirm) {

      // Clear or keep error
      error.password = currentError.password === 'form_error_passwords_mismatch' ? null : currentError.password;
      error.passwordConfirm = currentError.passwordConfirm === 'form_error_passwords_mismatch' ? null : currentError.passwordConfirm;

      return error;
    }

    error.password = 'passwords_mismatch';
    error.passwordConfirm = 'passwords_mismatch';

    return error;
  }

  /**
   * @inheritDoc
   */
  getModel(model: AccountModel, formGroup: FormGroup, path: string, value: Object|Object[]): AccountModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Updating agency ID
    if (path === 'agencyId') {

      newModel.contact.agency.id = <string>value;
    }

    // Updating firstname
    if (path === 'firstName') {

      newModel.contact.firstName = <string>value;
    }

    // Updating lastname
    if (path === 'lastName') {

      newModel.contact.lastName = <string>value;
    }

    // Updating account type ID
    if (path === 'accountTypeId') {

      newModel.accountType.value = <string>value;
    }

    // Updating language ID
    if (path === 'languageId') {

      newModel.language.value = <string>value;
    }

    return newModel;
  }
}
