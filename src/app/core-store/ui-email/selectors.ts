import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiEmailStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { EmailSummaryInterface } from '../../shared/interface/email-summary.interface';
import { selectDataAccounts } from '../data-account/selectors';
import { Dictionary } from '../../shared/class/dictionary';
import { AccountModel } from '../../shared/model/account.model';
import { selectDataAuthentication } from '../data-runtime/selectors';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { OptionGroupInterface } from '../../shared/interface/option-group.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiEmailStateInterface>
  = createFeatureSelector<UiEmailStateInterface>(FEATURE_NAME);

/**
 * Select summary
 */
export const selectUiSummary: MemoizedSelector<StateInterface, EmailSummaryInterface> = createSelector(
  selectUiState,
  (state: UiEmailStateInterface): EmailSummaryInterface => state.summary,
);

/**
 * Select sender options
 */
export const selectUiSenderOptions: MemoizedSelector<StateInterface, OptionGroupInterface[]> = createSelector(
  selectDataAccounts,
  selectDataAuthentication,
  (
    accounts: Dictionary<AccountModel>,
    authentication: RuntimeAuthenticationInterface,
  ): OptionGroupInterface[] => {

    const senderAccounts: AccountModel[] = Object
      .values(accounts)
      .filter(account => account.isEnabledSendEmailOnBehalf === true);

    const optionGroups: OptionGroupInterface[] = [
      {
        label: 'label_myself',
        options: [],
      },
      {
        label: 'label_on_behalf_of',
        options: [],
      },
    ];

    const contactIds = [];

    // For each contact
    senderAccounts.forEach((account) => {

      const contact = account.contact;

      // Already added
      if (contactIds.indexOf(contact.id) > -1) {

        return;
      }

      // Added contact
      contactIds.push(contact.id);

      // Find account contact's email
      const email = contact.getMainEmailAddress() || (contact.emails[0] && contact.emails[0].emailId) || '';

      if (!email) {

        return;
      }

      // Myself or other ?
      const index = contact.id === authentication.contactId ? 0 : 1;

      optionGroups[index].options.push({
        value: contact.id,
        text: [
          [contact.lastName, contact.firstName].join(' '),
          email,
        ].join(' - '),
      });
    });

    return optionGroups;
  });
