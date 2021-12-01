import { Injectable } from '@angular/core';

import { BrowserService } from '../core/shared/browser/browser.service';
import { LocalStorageService } from '../core/shared/storage/local-storage.service';
import { LocalStorageEnum } from '../shared/enum/local-storage.enum';

@Injectable()
export class AuthenticationConfig {

  /**
   * Current user contact
   */
  readonly contact: {
    id: string;
    firstName: string;
    lastName: string;
    genericFullName: string;
    avatar: string;
    mainEmail: string;
  } = {
    id: '',
    firstName: '',
    lastName: '',
    genericFullName: '',
    avatar: '',
    mainEmail: '',
  };

  /**
   * Current user agency
   */
  readonly agency: {
    id: string;
    name: string;
    logoURL: string;
  } = {
    id: '',
    name: '',
    logoURL: '',
  };

  /**
   * Current user account
   */
  readonly account: {
    id: string;
    typeId: string;
  } = {
    id: '',
    typeId: '',
  };

  /**
   * Symfony CRM authentication config
   */
  readonly symfonyCrm: {
    refreshToken: string;
  } = {
    refreshToken: '',
  };

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
    private localStorageService: LocalStorageService,
  ) {

    // Get backend config
    const config = this.browserService.getRealforceConfig<AuthenticationConfig>().authentication;

    // Store config in memory
    this.contact = config.contact || this.contact;
    this.agency = config.agency || this.agency;
    this.account = config.account || this.account;
    this.symfonyCrm = config.symfonyCrm || this.symfonyCrm;

    // Refresh token from local storage
    const refreshTokenFromStorage = this.localStorageService.getItem(LocalStorageEnum.rfRefreshToken);

    // Has refresh token from storage (Stored when the user switch to other user)
    if (refreshTokenFromStorage) {

      this.setRefreshToken(refreshTokenFromStorage);

      return;
    }

    // Store the refresh token in local storage, to inform all tabs that it's changed
    this.localStorageService.setItem(LocalStorageEnum.rfRefreshToken, this.symfonyCrm.refreshToken);

    // We won't keep the refresh token in local storage anymore, as it's already updated in all tabs
    this.localStorageService.removeItem(LocalStorageEnum.rfRefreshToken);
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {

    this.symfonyCrm.refreshToken = token;
  }
}
