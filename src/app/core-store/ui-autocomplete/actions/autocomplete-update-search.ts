import { FEATURE_NAME, UiAutocompleteStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { AutocompleteSearchInterface } from '../../../shared/interface/autocomplete-search.interface';

export class AutocompleteUpdateSearch implements ActionUpdateInterface<UiAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update search';
  readonly type: string = AutocompleteUpdateSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    search: AutocompleteSearchInterface;
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
      search: this.payload.search,
    };

    return newState;
  }
}
