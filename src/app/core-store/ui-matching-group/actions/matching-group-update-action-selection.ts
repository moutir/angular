import { FEATURE_NAME, UiMatchingGroupStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { MatchingGroupActionSelectionInterface } from '../../../shared/interface/matching-group-action-selection.interface';
import { Dictionary } from '../../../shared/class/dictionary';

export class MatchingGroupUpdateActionSelection implements ActionUpdateInterface<UiMatchingGroupStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update action selection';
  readonly type: string = MatchingGroupUpdateActionSelection.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    actionSelection: Dictionary<MatchingGroupActionSelectionInterface>;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMatchingGroupStateInterface): UiMatchingGroupStateInterface {

    return {
      ...state,
      actionSelection: {
        ...this.payload.actionSelection,
      },
    };
  }
}
