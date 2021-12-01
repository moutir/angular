import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { SuggestionVoteModel } from '../../../shared/model/suggestion-vote.model';

export class SuggestionEventVote implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event vote';
  readonly type: string = SuggestionEventVote.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    suggestionId: string;
    vote: SuggestionVoteModel;
  }) {

  }
}
