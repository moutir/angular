import { FEATURE_NAME, UiAutocompleteStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { UiAutocompleteInterface } from '../ui-autocomplete.interface';

export class AutocompleteSet implements ActionUpdateInterface<UiAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': set';
  readonly type: string = AutocompleteSet.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    autocomplete: UiAutocompleteInterface|null;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiAutocompleteStateInterface): UiAutocompleteStateInterface {

    const newState = {
      ...state,
    };

    // Set autocomplete
    if (this.payload.autocomplete !== null && !newState[this.payload.uid]) {

      newState[this.payload.uid] = {
        ...this.payload.autocomplete,
      };
    }

    // Unset autocomplete
    if (this.payload.autocomplete === null && !!newState[this.payload.uid]) {

      delete newState[this.payload.uid];
    }

    return newState;
  }
}
