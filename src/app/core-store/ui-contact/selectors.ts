import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { StateInterface } from '../state.interface';
import { FEATURE_NAME, UiContactStateInterface } from './state';
import { ContactModel } from '../../shared/model/contact.model';
import { selectDataByAgency, selectDataContacts } from '../data-contact/selectors';
import { ContactTransferInterface } from '../../shared/interface/contact-transfer.interface';
import { selectDataOptions } from '../data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { ContactTransferOptionsInterface } from '../../shared/interface/contact-transfer-options.interface';
import { ContactModifyBrokerOptionsInterface } from '../../shared/interface/contact-modify-broker-options.interface';
import { ContactModifyBrokerInterface } from '../../shared/interface/contact-modify-broker.interface';
import { OptionInterface } from '../../shared/interface/option.interface';
import { ContactTransferActivityInterface } from '../../shared/interface/contact-transfer-activity.interface';
import { ContactTransferActivityOptionsInterface } from '../../shared/interface/contact-transfer-activity-options.interface';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiContactStateInterface>
  = createFeatureSelector<UiContactStateInterface>(FEATURE_NAME);

/**
 * Select the contact to preview
 */
export const selectUiPreviewContact: MemoizedSelector<StateInterface, ContactModel|null> = createSelector(
  selectDataContacts,
  selectUiState,
  (contacts: Dictionary<ContactModel>, state: UiContactStateInterface): ContactModel|null => contacts[state.previewContactId] || null,
);

/**
 * Select contact IDs in basket
 */
export const selectUiBasketContactIds: MemoizedSelector<StateInterface, string[]> = createSelector(
  selectUiState,
  (state: UiContactStateInterface): string[] => state.basketContactIds,
);

/**
 * Select contact transfer
 */
export const selectUiTransfer: MemoizedSelector<StateInterface, ContactTransferInterface> = createSelector(
  selectUiState,
  (state: UiContactStateInterface): ContactTransferInterface => state.transfer,
);

/**
 * Select contact transfer options
 */
export const selectUiTransferOptions: MemoizedSelector<StateInterface, ContactTransferOptionsInterface> = createSelector(
  selectUiTransfer,
  selectDataOptions,
  selectDataByAgency,
  selectDataContacts,
  (
    transfer: ContactTransferInterface,
    runtimeOptions: RuntimeOptionsInterface,
    byAgency: Dictionary<string[]>,
    contacts: Dictionary<ContactModel>,
  ): ContactTransferOptionsInterface => {

    const options = {
      agency: [],
      broker: [],
    };

    // Has group of agencies
    if (runtimeOptions.agencyGroup.length > 0) {

      options.agency = options.agency.concat(runtimeOptions.agencyGroup);
    }

    // Has brokers per agency
    if (!!byAgency[transfer.agencyId]) {

      options.broker = byAgency[transfer.agencyId]
        .filter(id => !!contacts[id])
        .map(id => {

          return {
            value: contacts[id].id,
            text: contacts[id].fullName,
          };
        });
    }

    return options;
  },
);

/**
 * Select list of brokers options
 */
export const selectUiBrokerOptions: MemoizedSelector<StateInterface, OptionInterface[]> = createSelector(
  selectDataOptions,
  (
    options: RuntimeOptionsInterface,
  ): OptionInterface[] => {

    const brokerOptions = [];
    const brokerIds = [];

    [
      ...options.brokerSell,
      ...options.brokerRent,
      ...options.brokerColleague,
    ]
      .forEach(broker => {

        // Broker ID already used
        if (brokerIds.indexOf(broker.value) > -1) {

          return;
        }

        brokerIds.push(broker.value);
        brokerOptions.push(broker);
      });

    return brokerOptions.sort((a, b) => (a.text > b.text) ? 1 : -1);
  },
);

/**
 * Select contact modify broker
 */
export const selectUiModifyBroker: MemoizedSelector<StateInterface, ContactModifyBrokerInterface> = createSelector(
  selectUiState,
  (state: UiContactStateInterface): ContactModifyBrokerInterface => state.modifyBroker,
);

/**
 * Select contact modify broker options
 */
export const selectUiModifyBrokerOptions: MemoizedSelector<StateInterface, ContactModifyBrokerOptionsInterface> = createSelector(
  selectDataOptions,
  selectUiBrokerOptions,
  (
    options: RuntimeOptionsInterface,
    brokerOptions: OptionInterface[],
  ): ContactModifyBrokerOptionsInterface => {

    return {
      broker: brokerOptions,
      saleBroker: [ ...options.brokerSell ],
      rentalBroker: [ ...options.brokerRent ],
      brokerByAgency: options.brokerByAgency,
      brokerSellByAgency: options.brokerSellByAgency,
      brokerRentByAgency: options.brokerRentByAgency,
    };
  },
);

/**
 * Select contact transfer activity
 */
export const selectUiTransferActivity: MemoizedSelector<StateInterface, ContactTransferActivityInterface> = createSelector(
  selectUiState,
  (state: UiContactStateInterface): ContactTransferActivityInterface => state.transferActivity,
);

/**
 * Select contact transfer activity options
 */
export const selectUiTransferActivityOptions: MemoizedSelector<StateInterface, ContactTransferActivityOptionsInterface> = createSelector(
  selectUiBrokerOptions,
  (brokerOptions: OptionInterface[]): ContactTransferActivityOptionsInterface => {

    return {
      broker: brokerOptions,
    };
  },
);

/**
 * Select the profile form advanced mode
 */
export const selectUiIsProfileFormAdvanced: MemoizedSelector<StateInterface, boolean> = createSelector(
  selectUiState,
  (state: UiContactStateInterface): boolean => state.isProfileFormAdvanced,
);
