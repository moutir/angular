import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationApiPhalconService } from '../../../api/shared/authentication/authentication-api-phalcon.service';
import { AuthenticationApiSymfonyService } from '../../../api/shared/authentication/authentication-api-symfony.service';
import { AuthenticationSwitchResponseInterface } from '../../../api/shared/authentication/authentication-switch-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AccountModel } from '../../../shared/model/account.model';
import { BrowserService } from '../browser/browser.service';

@Injectable()
export class AuthenticationService {

  /**
   * Constructor
   */
  constructor(
    private authenticationApiPhalconService: AuthenticationApiPhalconService,
    private authenticationApiSymfonyService: AuthenticationApiSymfonyService,
    private browserService: BrowserService,
  ) {

  }

  /**
   * Reset token
   */
  resetToken(): void {

    this.authenticationApiSymfonyService.resetToken();
  }

  /**
   * Load list of accounts switchable to
   */
  switchList(): Observable<AccountModel[]> {

    return this.authenticationApiPhalconService.switchList();
  }

  /**
   * Switch user account
   */
  switchUser(accountId: string, accountLogin: string): Observable<AuthenticationSwitchResponseInterface> {

    return forkJoin(
      this.authenticationApiPhalconService.switchUser(accountId),
      this.authenticationApiSymfonyService.switchUser(accountLogin),
    ).pipe(
      map(responses => {

        return {
          success: responses[0].success,
          refresh_token: responses[1].refresh_token,
        };
      }),
      catchError(error => {

        return of({
          success: false,
          refresh_token: '',
        });
      }),
    );
  }

  /**
   * Logout the user
   */
  logout(): void {

    this.browserService.redirect(ApiEndpointEnum.accountLogout);
  }
}
