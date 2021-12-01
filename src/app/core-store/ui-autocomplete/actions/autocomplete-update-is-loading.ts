import { FEATURE_NAME, UiAutocompleteStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class AutocompleteUpdateIsLoading implements ActionUpdateInterface<UiAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is loading';
  readonly type: string = AutocompleteUpdateIsLoading.TYPE;

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
  reduce(state: UiAutocompleteStateInterface): UiAutocompleteStateInterface {

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
