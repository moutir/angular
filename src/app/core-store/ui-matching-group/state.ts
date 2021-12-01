import { Dictionary } from '../../shared/class/dictionary';
import { MatchingGroupActionSelectionInterface } from '../../shared/interface/matching-group-action-selection.interface';
import { MatchingGroupActionMenuInterface } from '../../shared/interface/matching-group-action-menu.interface';
import { MatchingGroupProposalInterface } from '../../shared/interface/matching-group-proposal.interface';

export const FEATURE_NAME = 'ui-matching-group';

export interface UiMatchingGroupStateInterface {

  // Action selection state
  actionSelection: Dictionary<MatchingGroupActionSelectionInterface>;

  // Action menu state
  actionMenu: MatchingGroupActionMenuInterface;

  // Proposal state
  proposal: MatchingGroupProposalInterface;

  // Toggle state
  toggle: Dictionary<boolean>;
}

export const initialState: UiMatchingGroupStateInterface = {
  actionSelection: {},
  actionMenu: {
    position: {
      x: 0,
      y: 0,
    },
    matchingGroup: null,
    matching: null,
  },
  proposal: {
    senderId: '',
    emailTemplateId: '',
    emailContentId: '',
    emailBrochureTypeId: '',
    emailBrochurePrivacyId: '',
    emailContentLanguageId: {},
    emailContentLanguageHtml: {},
  },
  toggle: {},
};
