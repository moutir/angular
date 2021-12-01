import { ActionUpdateInterface } from '../../action-update.interface';
import { DataAutocompleteStateInterface, FEATURE_NAME } from '../state';
import { OptionInterface } from '../../../shared/interface/option.interface';

export class AutocompleteUpdateOptions implements ActionUpdateInterface<DataAutocompleteStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update options';
  readonly type: string = AutocompleteUpdateOptions.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    options: {
      property?: OptionInterface[];
      promotion?: OptionInterface[];
      contact?: OptionInterface[];
      location?: OptionInterface[];
      taskAssignee?: OptionInterface[];
      taskAddressee?: OptionInterface[];
      broker?: OptionInterface[];
      reportContact?: OptionInterface[];
    };
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataAutocompleteStateInterface): DataAutocompleteStateInterface {

    const newState: DataAutocompleteStateInterface = {
      ...state,
      options: {
        ...state.options,
      },
    };

    // For each payload's option
    Object
      .keys(this.payload.options)
      .forEach(name => {

        newState.options[name] = {
          ...state.options[name],
        };

        // For each option to update
        this.payload.options[name].forEach(option => {

          // Update option in state
          newState.options[name][option.value] = option;
        });
      });

    return newState;
  }
}
