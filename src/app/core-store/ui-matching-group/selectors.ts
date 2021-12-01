import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiMatchingGroupStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { selectUiForm } from '../ui-searchlist/selectors';
import { MatchingGroupSearchModel } from '../../shared/model/matching-group-search.model';
import { selectDataFeatureBrochure, selectDataOptions, selectDataPermissions } from '../data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { MatchingGroupProposalInterface } from '../../shared/interface/matching-group-proposal.interface';
import { MatchingGroupActionMenuInterface } from '../../shared/interface/matching-group-action-menu.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { MatchingActionEnum } from '../../shared/enum/matching-action.enum';
import { MatchingGroupActionLabelInterface } from '../../shared/interface/matching-group-action-label.interface';
import { MatchingGroupActionSelectionInterface } from '../../shared/interface/matching-group-action-selection.interface';
import { selectDataEmailContents } from '../data-email/selectors';
import { selectDataMatchingGroups } from '../data-matching-group/selectors';
import { selectUiSenderOptions } from '../ui-email/selectors';
import { EmailContentModel } from '../../shared/model/email-content.model';
import { MatchingGroupModel } from '../../shared/model/matching-group.model';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { OptionGroupInterface } from '../../shared/interface/option-group.interface';
import { MatchingGroupProposalOptionsInterface } from '../../shared/interface/matching-group-proposal-options.interface';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiMatchingGroupStateInterface>
  = createFeatureSelector<UiMatchingGroupStateInterface>(FEATURE_NAME);

/**
 * Select the toggle state
 */
export const selectUiToggle: MemoizedSelector<StateInterface, Dictionary<boolean>> = createSelector(
  selectUiState,
  (state: UiMatchingGroupStateInterface): Dictionary<boolean> => state.toggle,
);

/**
 * Select the matching group type
 */
export const selectUiMatchingGroupType = (
  uid: string,
): MemoizedSelector<StateInterface, string> => createSelector(
  selectUiForm(uid),
  (form: MatchingGroupSearchModel): string => form.matchingGroupType,
);

/**
 * Select actions
 */
export const selectUiActions: MemoizedSelector<StateInterface, Dictionary<string>> = createSelector(
  selectUiState,
  (state: UiMatchingGroupStateInterface): Dictionary<string> => {

    const methods: Dictionary<string> = {};

    methods[MatchingActionEnum.wait] = 'label_waiting';
    methods[MatchingActionEnum.transfer] = 'label_transfer';
    methods[MatchingActionEnum.process] = 'label_process';
    methods[MatchingActionEnum.send] = 'label_send_proposal';
    methods[MatchingActionEnum.refuse] = 'label_reject_definitely';
    methods[MatchingActionEnum.delay] = 'label_reject_temporarily';

    return methods;
  },
);

/**
 * Select the action selection state
 */
export const selectUiActionSelection: MemoizedSelector<StateInterface, Dictionary<MatchingGroupActionSelectionInterface>> = createSelector(
  selectUiState,
  (state: UiMatchingGroupStateInterface): Dictionary<MatchingGroupActionSelectionInterface> => state.actionSelection,
);

/**
 * Select the action label state
 */
export const selectUiActionLabel: MemoizedSelector<StateInterface, Dictionary<MatchingGroupActionLabelInterface>> = createSelector(
  selectUiActionSelection,
  selectUiActions,
  selectDataOptions,
  (
    actionSelection: Dictionary<MatchingGroupActionSelectionInterface>,
    actions: Dictionary<string>,
    options: RuntimeOptionsInterface,
  ): Dictionary<MatchingGroupActionLabelInterface> => {

    const actionLabel: Dictionary<MatchingGroupActionLabelInterface> = {};

    Object
      .keys(actionSelection)
      .forEach(id => {

        const action = actionSelection[id];

        actionLabel[id] = {
          main: actions[action.actionId] || actions[MatchingActionEnum.wait],
          secondary: '',
        };

        // Has broker ID
        if (action.brokerId !== null) {

          const brokerOption = options.brokerColleague.find(option => option.value === action.brokerId);

          if (!!brokerOption) {

            actionLabel[id].secondary = brokerOption.text;
          }
        }

        // Has method ID
        if (action.methodId !== null) {

          // For each matching process method
          const methodOption = options.matchingProcessMethod.find(option => option.value === action.methodId);

          if (!!methodOption) {

            actionLabel[id].secondary = methodOption.text;
          }
        }
      });

    return actionLabel;
  },
);

/**
 * Select the action menu state
 */
export const selectUiActionMenu: MemoizedSelector<StateInterface, MatchingGroupActionMenuInterface> = createSelector(
  selectUiState,
  (state: UiMatchingGroupStateInterface): MatchingGroupActionMenuInterface => state.actionMenu,
);

/**
 * Select the action menu items
 */
export const selectUiActionMenuItems: MemoizedSelector<StateInterface, MenuInterface> = createSelector(
  selectUiActionMenu,
  selectUiActions,
  selectDataOptions,
  selectDataPermissions,
  (
    actionMenu: MatchingGroupActionMenuInterface,
    actions: Dictionary<string>,
    options: RuntimeOptionsInterface,
    permissions: PermissionEnum[],
  ): MenuInterface => {

    const matchingGroupId: string|null = actionMenu.matchingGroup !== null ? actionMenu.matchingGroup.id : null;
    const matchingId: string|null = actionMenu.matching !== null ? actionMenu.matching.id : null;
    const contactId: string|null = actionMenu.matching !== null ? actionMenu.matching.contact.id : null;

    const menu: MenuInterface = {
      items: [],
    };

    // Wait
    menu.items.push({
      id: JSON.stringify({
        matchingGroupId: matchingGroupId,
        matchingId: matchingId,
        actionId: MatchingActionEnum.wait,
        contactId: contactId,
        methodId: null,
        brokerId: null,
      }),
      label: actions[MatchingActionEnum.wait],
      icon: '',
      tooltip: '',
      isEnabled: true,
      items: [],
    });

    // Transfer
    menu.items.push({
      id: JSON.stringify({
        matchingGroupId: matchingGroupId,
        matchingId: matchingId,
        actionId: MatchingActionEnum.transfer,
        contactId: contactId,
        methodId: null,
        brokerId: null,
      }),
      label: actions[MatchingActionEnum.transfer],
      icon: '',
      tooltip: '',
      isEnabled: true,
      items: [],
    });

    // For each broker colleague
    options.brokerColleague.forEach(option => {

      const index = menu.items.length - 1;

      // Add menu child
      menu.items[index].items.push({
        id: JSON.stringify({
          matchingGroupId: matchingGroupId,
          matchingId: matchingId,
          actionId: MatchingActionEnum.transfer,
          contactId: contactId,
          methodId: null,
          brokerId: option.value,
        }),
        label: option.text,
        icon: '',
        tooltip: '',
        isEnabled: true,
        items: [],
      });
    });

    // Processed
    menu.items.push({
      id: JSON.stringify({
        matchingGroupId: matchingGroupId,
        matchingId: matchingId,
        actionId: MatchingActionEnum.process,
        contactId: contactId,
        methodId: null,
        brokerId: null,
      }),
      label: actions[MatchingActionEnum.process],
      icon: '',
      tooltip: '',
      isEnabled: true,
      items: [],
    });

    // For each matching process method
    options.matchingProcessMethod.forEach(option => {

      const index = menu.items.length - 1;

      // Add menu child
      menu.items[index].items.push({
        id: JSON.stringify({
          matchingGroupId: matchingGroupId,
          matchingId: matchingId,
          actionId: MatchingActionEnum.process,
          contactId: contactId,
          methodId: option.value,
          brokerId: null,
        }),
        label: option.text,
        icon: '',
        tooltip: '',
        isEnabled: true,
        items: [],
      });
    });

    // Email
    if (permissions.indexOf(PermissionEnum.mailboxWrite)) {

      let isEnabled = true;

      // Matching group row
      if (actionMenu.matchingGroup !== null && actionMenu.matching === null) {

        // At least one matching contact's email is valid
        isEnabled = actionMenu.matchingGroup.matchings.some(matching => matching.contact.isValidEmail === true);
      }

      // Matching row
      if (actionMenu.matchingGroup !== null && actionMenu.matching !== null) {

        isEnabled = actionMenu.matching.contact.isValidEmail;
      }

      menu.items.push({
        id: JSON.stringify({
          matchingGroupId: matchingGroupId,
          matchingId: matchingId,
          actionId: MatchingActionEnum.send,
          contactId: contactId,
          methodId: null,
          brokerId: null,
        }),
        label: actions[MatchingActionEnum.send],
        icon: '',
        tooltip: isEnabled === false ? 'label-global-matching-no-email' : '',
        isEnabled: isEnabled,
        items: [],
      });
    }

    // Refuse
    menu.items.push({
      id: JSON.stringify({
        matchingGroupId: matchingGroupId,
        matchingId: matchingId,
        actionId: MatchingActionEnum.refuse,
        contactId: contactId,
        methodId: null,
        brokerId: null,
      }),
      label: actions[MatchingActionEnum.refuse],
      icon: '',
      tooltip: '',
      isEnabled: true,
      items: [],
    });

    // Delay
    menu.items.push({
      id: JSON.stringify({
        matchingGroupId: matchingGroupId,
        matchingId: matchingId,
        actionId: MatchingActionEnum.delay,
        contactId: contactId,
        methodId: null,
        brokerId: null,
      }),
      label: actions[MatchingActionEnum.delay],
      icon: '',
      tooltip: '',
      isEnabled: true,
      items: [],
    });

    return menu;
  },
);

/**
 * Select proposal
 */
export const selectUiProposal: MemoizedSelector<StateInterface, MatchingGroupProposalInterface> = createSelector(
  selectUiState,
  (
    state: UiMatchingGroupStateInterface,
  ): MatchingGroupProposalInterface => state.proposal,
);

/**
 * Select proposal options
 */
export const selectUiProposalOptions: MemoizedSelector<StateInterface, MatchingGroupProposalOptionsInterface> = createSelector(
  selectUiProposal,
  selectDataOptions,
  selectDataEmailContents,
  selectDataMatchingGroups,
  selectDataFeatureBrochure,
  selectUiActionSelection,
  selectUiSenderOptions,
  (
    proposal: MatchingGroupProposalInterface,
    options: RuntimeOptionsInterface,
    emailContents: Dictionary<EmailContentModel>,
    matchingGroups: Dictionary<MatchingGroupModel>,
    featureBrochure: RuntimeFeatureBrochureInterface,
    actionSelection: Dictionary<MatchingGroupActionSelectionInterface>,
    senderOptions: OptionGroupInterface[],
  ): MatchingGroupProposalOptionsInterface => {

    const privacyIds = featureBrochure.mapping.brochureIdToPrivacyIds[proposal.emailBrochureTypeId] || [];

    // Default options
    const proposalOptions: MatchingGroupProposalOptionsInterface = {
      sender: senderOptions,
      emailTemplate: options.emailTemplate,
      emailContent: options.emailContent,
      emailBrochureTypeId: options.propertyBrochureType, // Yes, always propose the property brochure types, never promotions
      emailBrochurePrivacyId: options.brochurePrivacy.filter(option => privacyIds.indexOf(option.value) > -1),
      emailContentLanguages: null,
      emailContentContacts: null,
      emailContentContactLanguages: null,
    };

    // Selected email content
    const emailContent = emailContents[proposal.emailContentId] || null;

    // Has no selected email content
    if (emailContent === null) {

      return proposalOptions;
    }

    // Define languages options based on email content available languages
    proposalOptions.emailContentLanguages = options.languageCommunication
      .filter(option => !!emailContent.subject[option.value] && !!emailContent.html[option.value]);

    // Selected matching group IDs with a "send" action on at least one of their matching
    const matchingGroupIds = [];
    const matchingIds = [];

    Object
      .keys(actionSelection)
      .forEach(id => {

        // Is not "send" action
        if (actionSelection[id].actionId !== MatchingActionEnum.send) {

          return;
        }

        if (matchingGroupIds.indexOf(actionSelection[id].matchingGroupId) === -1) {

          matchingGroupIds.push(actionSelection[id].matchingGroupId);
        }

        if (matchingIds.indexOf(actionSelection[id].matchingId) === -1) {

          matchingIds.push(actionSelection[id].matchingId);
        }
      });

    // Define contacts options
    proposalOptions.emailContentContacts = [];

    // Available languages
    const languages = proposalOptions.emailContentLanguages.map(option => option.value);
    const contactIds = [];
    const contacts = [];

    matchingGroupIds.forEach(matchingGroupId => {

      if (!matchingGroups[matchingGroupId]) {

        return;
      }

      matchingGroups[matchingGroupId].matchings.forEach(matching => {

        // Matching not selected or contact already listed
        if (matchingIds.indexOf(matching.id) === -1 || contactIds.indexOf(matching.contact.id) > -1) {

          return;
        }

        // Contact language available AND not already listed
        if (matching.contact.languageId !== null && contacts.some(c => c.id === matching.contact.id) === false) {

          contacts.push(matching.contact);
        }

        // Contact language not set or not in available languages list
        if (matching.contact.languageId === null || languages.indexOf(matching.contact.languageId) === -1) {

          proposalOptions.emailContentContacts.push(matching.contact);
          contactIds.push(matching.contact.id);
        }
      });
    });

    // Dictionary of count of the languages available for contacts
    const langCountMap = {};

    contacts.forEach(contact => {

      langCountMap[contact.languageId] = langCountMap[contact.languageId] || 0;

      // Contact language not set manually
      if (Object.keys(proposal.emailContentLanguageId).indexOf(contact.id) === -1) {

        langCountMap[contact.languageId]++;
      }
    });

    // Count of manually picked email content languages for contacts
    Object
      .values(proposal.emailContentLanguageId)
      .forEach(languageId => langCountMap[languageId] = (langCountMap[languageId] || 0) + 1);

    // Languages available for all contacts (sorted by text)
    proposalOptions.emailContentContactLanguages = Object
      .keys(langCountMap)
      .filter(languageId => langCountMap[languageId])
      .map(languageId => {

        return {
          ...options.languageCommunication.find(option => option.value === String(languageId)),
          count: langCountMap[languageId],
        };
      })
      .sort((a, b) => (a.text > b.text) ? 1 : -1)
    ;

    return proposalOptions;
  },
);
