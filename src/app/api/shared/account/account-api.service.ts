import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { AccountModel } from '../../../shared/model/account.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { AccountListRequestInterface } from './account-list-request.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { ContactApiPhalconService } from '../contact/contact-api-phalcon.service';
import { ContactModel } from '../../../shared/model/contact.model';
import { AccountSwitchModel } from '../../../shared/model/account-switch.model';
import { LegacyAccountHydrator } from '../../format/legacy/data/legacy-account.hydrator';
import { LegacyAccountDataInterface } from '../../format/legacy/data/legacy-account-data.interface';

@Injectable()
export class AccountApiService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private contactApiPhalconService: ContactApiPhalconService,
    private legacyAccountHydrator: LegacyAccountHydrator,
  ) {

    super();
  }

  /**
   * List accounts
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: AccountSearchModel,
  ): Observable<ModelListInterface<AccountModel>> {

    const request = <AccountListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.agencyId) {

      request.agency_id = filters.agencyId;
    }

    if (filters.accountTypeId) {

      request.account_type_id = filters.accountTypeId;
    }

    if (filters.contactId) {

      request.contact_id = filters.contactId;
    }

    if (filters.login) {

      request.login = filters.login;
    }

    if (filters.isActive01 !== null) {

      request.is_active = filters.isActive01;
    }

    return this
      .httpService
      .get<AccountListRequestInterface, LegacyListResponseInterface<LegacyAccountDataInterface>>(
        ApiEndpointEnum.accountList,
        request,
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacyAccountHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Load account
   */
  load(id: string): Observable<AccountModel> {

    // Stuck with horrible legacy logic, we load an account through the contact endpoint!
    return this
      .contactApiPhalconService
      .load(id, 'account')
      .pipe(
        map(contact => {

          const account = new AccountModel();

          account.contact = contact;

          account.id = contact.accountId;
          account.agencyId = contact.agency.id;
          account.login = contact.accountLogin;
          account.accountType.value = contact.accountTypeId;
          account.accountType.text = contact.accountTypeLabel;
          account.expiryDate = contact.accountExpiryDate;
          account.notes = contact.accountNotes;
          account.language.value = contact.accountLanguageId;
          account.privileges = contact.accountPrivileges;
          account.isActive = contact.accountIsActive;
          account.isAllowedSwitching = contact.accountIsAllowedSwitching;
          account.isEnabledSendEmailOnBehalf = contact.accountIsEnabledSendEmailOnBehalf;
          account.isEnabledGoogleAgenda = contact.accountIsEnabledGoogleAgenda;
          account.lastLoginDate = contact.accountLastLoginDate;
          account.lastSeenDate = contact.accountLastSeenDate;
          account.lastSeenIp = contact.accountLastSeenIp;
          account.lastSeenUserAgent = contact.accountLastSeenUserAgent;
          account.createContact = contact.createContact;
          account.createDate = contact.createDate;
          account.updateContact = contact.updateContact;
          account.updateDate = contact.updateDate;
          account.accountSwitches = contact.accountSwitchAccounts.map(accountSwitchAccount => {

            const accountSwitch = new AccountSwitchModel();

            accountSwitch.id = accountSwitchAccount.id;
            accountSwitch.account.id = accountSwitchAccount.accountId;
            accountSwitch.account.login = accountSwitchAccount.accountLogin;
            accountSwitch.isRemoved = accountSwitchAccount.isRemoved;

            return accountSwitch;
          });

          return account;
        }),
      );
  }

  /**
   * Save account
   */
  save(model: AccountModel): Observable<LegacySaveResponseInterface> {

    const contact = model.contact.clone<ContactModel>();

    contact.accountId = model.id;
    contact.accountLogin = model.login;
    contact.accountPassword = model.password;
    contact.accountPasswordConfirm = model.passwordConfirm;
    contact.accountTypeId = model.accountType.value;
    contact.accountExpiryDate = model.expiryDate;
    contact.accountNotes = model.notes;
    contact.accountLanguageId = model.language.value;
    contact.accountPrivileges = model.privileges;
    contact.accountIsActive = model.isActive;
    contact.agency.id = model.agencyId;
    contact.accountSwitchAccounts = model.accountSwitches.map(accountSwitchModel => {

      return {
        id: accountSwitchModel.id,
        accountId: accountSwitchModel.account.id,
        accountLogin: accountSwitchModel.account.login,
        isRemoved: accountSwitchModel.isRemoved,
      };
    });

    return this
      .contactApiPhalconService
      .save(contact);
  }
}
