import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class SearchlistUpdateIsLoading implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is loading';
  readonly type: string = SearchlistUpdateIsLoading.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    isLoading: boolean;
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
      isLoading: this.payload.isLoading,
    };

    return newState;
  }
}
