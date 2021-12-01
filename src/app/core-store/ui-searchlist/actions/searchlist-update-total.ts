import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class SearchlistUpdateTotal implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update total';
  readonly type: string = SearchlistUpdateTotal.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    total: number;
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
      total: this.payload.total,
    };

    return newState;
  }
}
