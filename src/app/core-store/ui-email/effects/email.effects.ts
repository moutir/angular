import { Observable, of, zip } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';

import { AccountUpsert } from '../../data-account/actions/account-upsert';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { EmailEventListSender } from '../actions/email-event-list-sender';
import { AuthenticationStore } from '../../../authentication/shared/authentication.store';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { AccountService } from '../../../core/shared/account/account.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AccountModel } from '../../../shared/model/account.model';

@Injectable()
export class EmailEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private authenticationStore: AuthenticationStore,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Perform API call to load accounts list filtered by send email on behalf
   *
   * @action EmailEventListSender
   */
  EmailEventListSender$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailEventListSender>(EmailEventListSender.TYPE),
    switchMap(action => zip(
      of(action),
      this.authenticationStore.user$,
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, authUser, feature]) => {

      const senderAccounts = [authUser.account.clone<AccountModel>()].map(account => {

        const newAccount = account.clone<AccountModel>();
        newAccount.isEnabledSendEmailOnBehalf = true;

        return newAccount;
      });

      // User cannot send on behalf
      if (feature.sendEmailOnBehalf === false) {

        return [

          // Upsert account
          new AccountUpsert({
            models: senderAccounts,
          }),
        ];
      }

      const accountFilters = new AccountSearchModel();
      accountFilters.isAllowSendEmailOnBehalf = true;

      return this
        .accountService
        .listJsonapi(
          { page: 1, perPage: 100 },
          { id: 'last_name', order: OrderEnum.asc },
          accountFilters,
        ).pipe(

          // Success
          switchMap(list => {

            // Accounts should allow email send on behalf
            const accounts = senderAccounts
              .concat(list.models)
              .map(account => {

                const newAccount = account.clone<AccountModel>();
                newAccount.isEnabledSendEmailOnBehalf = true;

                return newAccount;
              });

            return [

              // Upsert account
              new AccountUpsert({
                models: accounts,
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '59', error: error }),

            // Upsert account
            new AccountUpsert({
              models: senderAccounts,
            }),
          ]),
        );
    })),
  );
}
