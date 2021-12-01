import { FEATURE_NAME, UiMatchingGroupStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { MatchingGroupProposalInterface } from '../../../shared/interface/matching-group-proposal.interface';

export class MatchingGroupUpdateProposal implements ActionUpdateInterface<UiMatchingGroupStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update proposal';
  readonly type: string = MatchingGroupUpdateProposal.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    proposal: MatchingGroupProposalInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMatchingGroupStateInterface): UiMatchingGroupStateInterface {

    return {
      ...state,
      proposal: {
        ...this.payload.proposal,
      },
    };
  }
}
