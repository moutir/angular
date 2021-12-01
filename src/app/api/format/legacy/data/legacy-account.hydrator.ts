import { Injectable } from '@angular/core';

import { LegacyAccountDataInterface } from './legacy-account-data.interface';
import { AccountModel } from '../../../../shared/model/account.model';
import { HelperService } from '../../../../core/shared/helper.service';
import { LegacyContactHydrator } from './legacy-contact.hydrator';

@Injectable()
export class LegacyAccountHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyContactHydrator: LegacyContactHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a AccountModel from AccountDataInterface
   */
  hydrateModel(data: LegacyAccountDataInterface): AccountModel {

    const account = new AccountModel();

    account.id = data.id;
    account.contact = this.legacyContactHydrator.hydrateModel(data.contact);
    account.accountType = data.accountType;
    account.login = data.login;
    account.password = data.password;
    account.passwordConfirm = data.passwordConfirm;
    account.isActive = data.isActive;
    account.expiryDate = this.helperService.stringToDate(data.expiryDate, false);
    account.notes = data.notes;
    account.language = data.language;
    account.isAllowedSwitching = data.allowSwitchingToThisAccount;
    account.isEnabledSendEmailOnBehalf = data.allowSendOnBehalf;
    account.lastLoginDate = this.helperService.stringToDate(data.lastLoginDate, false);
    account.lastSeenDate = this.helperService.stringToDate(data.lastSeenDate, false);
    account.lastSeenIp = data.lastSeenIp;
    account.lastSeenUserAgent = data.lastSeenUserAgent;
    account.createDate = this.helperService.stringToDate(data.createDatetime, false);
    account.updateDate = this.helperService.stringToDate(data.updateDatetime, false);

    if (data.createContact) {

      account.createContact = this.legacyContactHydrator.hydrateModel(data.createContact);
    }

    if (data.updateContact) {

      account.updateContact = this.legacyContactHydrator.hydrateModel(data.updateContact);
    }

    return account;
  }
}
