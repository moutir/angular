import { FEATURE_NAME, UiAutocompleteStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class AutocompleteUpdateHash implements ActionUpdateInterface<UiAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update hash';
  readonly type: string = AutocompleteUpdateHash.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    hash: string;
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
      hash: this.payload.hash,
    };

    return newState;
  }
}
