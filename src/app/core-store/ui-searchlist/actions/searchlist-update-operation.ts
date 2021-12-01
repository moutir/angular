import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class SearchlistUpdateOperation implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update operation';
  readonly type: string = SearchlistUpdateOperation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    operation: string;
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
      operation: this.payload.operation,
    };

    return newState;
  }
}
