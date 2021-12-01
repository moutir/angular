import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ListSelectionInterface } from '../../../shared/interface/list-selection.interface';

export class SearchlistUpdateSelection implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update selection';
  readonly type: string = SearchlistUpdateSelection.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    selection: ListSelectionInterface;
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
      selection: this.payload.selection,
    };

    return newState;
  }
}
