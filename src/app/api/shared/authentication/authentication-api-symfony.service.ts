import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { SymfonyHttpService } from '../../http/symfony-http.service';
import { AuthenticationSwitchSymfonyRequestInterface } from './authentication-switch-symfony-request.interface';
import { AuthenticationSwitchSymfonyResponseInterface } from './authentication-switch-symfony-response.interface';

@Injectable()
export class AuthenticationApiSymfonyService {

  /**
   * Constructor
   */
  constructor(
    private httpService: SymfonyHttpService,
  ) {

  }

  /**
   * Reset token
   */
  resetToken(): void {

    this.httpService.resetToken();
  }

  /**
   * Switch user account
   */
  switchUser(accountLogin: string): Observable<AuthenticationSwitchSymfonyResponseInterface> {

    const request: AuthenticationSwitchSymfonyRequestInterface = {
      username: accountLogin,
    };

    return this.httpService.post<AuthenticationSwitchSymfonyRequestInterface, AuthenticationSwitchSymfonyResponseInterface>
      (ApiEndpointEnum.accountSwitchSymfony, request);
  }
}
