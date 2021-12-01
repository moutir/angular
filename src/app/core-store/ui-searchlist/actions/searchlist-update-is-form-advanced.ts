import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class SearchlistUpdateIsFormAdvanced implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is form advanced';
  readonly type: string = SearchlistUpdateIsFormAdvanced.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    isFormAdvanced: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiSearchlistStateInterface): UiSearchlistStateInterface {

    const newState = {
      ...state,
    };

    newState[this.payload.uid] = {
      ...state[this.payload.uid],
      isFormAdvanced: this.payload.isFormAdvanced,
    };

    return newState;
  }
}
