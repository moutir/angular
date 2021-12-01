import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AccountModel } from '../../../shared/model/account.model';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { AuthenticationSwitchPhalconResponseInterface } from './authentication-switch-phalcon-response.interface';
import { AuthenticationSwitchPhalconRequestInterface } from './authentication-switch-phalcon-request.interface';
import { AuthenticationListPhalconResponseInterface } from './authentication-list-phalcon-response.interface';

@Injectable()
export class AuthenticationApiPhalconService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load list of accounts switchable to
   */
  switchList(): Observable<AccountModel[]> {

    return this
      .httpService
      .get<null, AuthenticationListPhalconResponseInterface>(ApiEndpointEnum.accountAvailableList)
      .pipe(
        map(response => {

          return response.agency
            .concat(response.other)
            .map(userData => {

              const account = new AccountModel();
              account.id = userData.account_id;
              account.login = userData.login;
              account.contact.accountId = userData.account_id;
              account.contact.accountTypeId = userData.account_type_id;
              account.contact.id = userData.id;
              account.contact.firstName = userData.firstname;
              account.contact.lastName = userData.lastname;
              account.contact.photoURL = userData.avatar;
              account.contact.agency.id = userData.agency_id;
              account.contact.agency.name = userData.agency_name;
              account.contact.agency.city = userData.city;

              return account;
            });
        }),
      );
  }

  /**
   * Switch user account
   */
  switchUser(accountId: string): Observable<AuthenticationSwitchPhalconResponseInterface> {

    const request: AuthenticationSwitchPhalconRequestInterface = {
      account_id: accountId,
    };

    return this.httpService.post<AuthenticationSwitchPhalconRequestInterface, AuthenticationSwitchPhalconResponseInterface>
    (ApiEndpointEnum.accountSwitch, request, null, true);
  }
}
