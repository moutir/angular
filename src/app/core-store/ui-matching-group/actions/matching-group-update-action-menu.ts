import { FEATURE_NAME, UiMatchingGroupStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { MatchingGroupActionMenuInterface } from '../../../shared/interface/matching-group-action-menu.interface';

export class MatchingGroupUpdateActionMenu implements ActionUpdateInterface<UiMatchingGroupStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update action menu';
  readonly type: string = MatchingGroupUpdateActionMenu.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    actionMenu: MatchingGroupActionMenuInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMatchingGroupStateInterface): UiMatchingGroupStateInterface {

    return {
      ...state,
      actionMenu: {
        ...this.payload.actionMenu,
      },
    };
  }
}
