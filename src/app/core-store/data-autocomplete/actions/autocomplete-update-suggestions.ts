import { ActionUpdateInterface } from '../../action-update.interface';
import { DataAutocompleteStateInterface, FEATURE_NAME } from '../state';
import { AutocompleteSuggestionInterface } from '../../../shared/interface/autocomplete-suggestion.interface';

export class AutocompleteUpdateSuggestions implements ActionUpdateInterface<DataAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update suggestions';
  readonly type: string = AutocompleteUpdateSuggestions.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    hash: string;
    suggestions: AutocompleteSuggestionInterface[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataAutocompleteStateInterface): DataAutocompleteStateInterface {

    const newState: DataAutocompleteStateInterface = {
      ...state,
      suggestions: {
        ...state.suggestions,
      },
    };

    newState.suggestions[this.payload.hash] = this.payload.suggestions.map(suggestions => {

      return {
        entity: suggestions.entity,
        values: suggestions.options.map(option => option.value),
      };
    });

    return newState;
  }
}
