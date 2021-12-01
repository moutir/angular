import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { FormComponentAbstract } from '../form/form-component.abstract';
import { AccountModel } from '../../model/account.model';
import { AccountOptionsInterface } from '../../interface/account-options.interface';
import { AccountModelAdapterStrategy } from '../../../core/shared/account/account-model-adapter.strategy';
import { PermissionEnum } from '../../enum/permission.enum';
import { RuntimeFeatureInterface } from '../../interface/runtime-feature.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { LanguageEnum } from '../../enum/language.enum';
import { RuntimeFeatureAccountInterface } from '../../interface/runtime-feature-account.interface';
import { EntityEnum } from '../../enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../interface/autocomplete-selection.interface';

@Component({
  selector: 'app-shared-account-form-required',
  templateUrl: './account-form-required.component.html',
  styleUrls: ['./account-form-required.component.scss'],
})
export class AccountFormRequiredComponent extends FormComponentAbstract<
  AccountModel,
  AccountOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly PERMISSION_AGENDA_READ: PermissionEnum = PermissionEnum.agendaRead;
  readonly PERMISSION_ACCOUNT_ADMIN: PermissionEnum = PermissionEnum.accountAdmin;
  readonly AUTOCOMPLETE_ENTITIES_ACCOUNT: EntityEnum[] = [EntityEnum.account];

  /**
   * Form layout
   */
  @Input() layout: 'account'|'user' = 'account';

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Feature account
   */
  @Input() featureAccount: RuntimeFeatureAccountInterface;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: AccountModelAdapterStrategy,
    private runtimeService: RuntimeService,
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

    // New account
    if (!this.model.id) {

      this.applyPrivilegePreset(this.model.accountType.value);
    }

    return true;
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = {
      emitEvent: false,
    };

    if (this.layout !== 'user') {

      this.formGroup.get('isEnabledSendEmailOnBehalf').disable(options);
      this.formGroup.get('isEnabledGoogleAgenda').disable(options);
      this.formGroup.get('isAllowedSwitching').disable(options);
    }

    if (
      this.layout !== 'account' ||
      this.options.agency.length === 0 ||
      !!this.model.id ||
      this.permissions.indexOf(this.PERMISSION_ACCOUNT_ADMIN) === -1
    ) {

      this.formGroup.get('agencyId').disable(options);
    }

    if (this.layout !== 'account') {

      this.formGroup.get('accountTypeId').disable(options);
    }
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionAccount(selection: AutocompleteSelectionInterface, index: number): void {

    const account = new AccountModel();
    account.id = selection.id;
    account.login = selection.text;

    this.setValue(['accountSwitches', index, 'account'].join('.'), account);
  }

  /**
   * Changed privileges
   */
  onChangePrivileges(privileges: string[]): void {

    this.setValue('privileges', privileges);
  }

  /**
   * Selected account type ID
   */
  onSelectAccountTypeId(event: MatSelectChange): void {

    this.applyPrivilegePreset(event.value);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.subscriptions.push(
      this.runtimeService.selectCurrentLanguageId().subscribe(languageId => this.onNextCurrentLanguageId(languageId)),
    );
  }

  /**
   * Apply privilege preset
   */
  protected applyPrivilegePreset(accountTypeId: string): void {

    if (!this.featureAccount.accountTypeMapping[accountTypeId]) {

      return;
    }

    const privileges = [];
    const privilegePreset = this.featureAccount.accountTypeMapping[accountTypeId].privilege;

    // Add preset privileges
    Object
      .keys(privilegePreset)
      .forEach(module => {

        privilegePreset[module]
          .forEach(group => {

            if (this.featureAccount.privilegeMapping[module] && this.featureAccount.privilegeMapping[module][group]) {

              this.featureAccount.privilegeMapping[module][group]
                .forEach(privilege => privileges.push(String(privilege)));
            }
          });
      });

    setTimeout(() => this.setValue('privileges', privileges));
  }

  /**
   * Next current language ID
   */
  private onNextCurrentLanguageId(languageId: LanguageEnum): void {

    // Default language
    if (!this.model.language.value) {

      this.setValue('languageId', languageId);
    }
  }
}
