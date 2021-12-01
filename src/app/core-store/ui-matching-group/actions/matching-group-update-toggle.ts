import { Dictionary } from '../../../shared/class/dictionary';
import { FEATURE_NAME, UiMatchingGroupStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class MatchingGroupUpdateToggle implements ActionUpdateInterface<UiMatchingGroupStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update toggle';
  readonly type: string = MatchingGroupUpdateToggle.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    toggle: Dictionary<boolean>;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMatchingGroupStateInterface): UiMatchingGroupStateInterface {

    return {
      ...state,
      toggle: {
        ...this.payload.toggle,
      },
    };
  }
}
