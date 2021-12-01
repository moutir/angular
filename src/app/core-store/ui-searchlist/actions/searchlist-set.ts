import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { SearchlistInterface } from '../../../shared/interface/searchlist.interface';

export class SearchlistSet implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': set';
  readonly type: string = SearchlistSet.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    searchlist: SearchlistInterface|null;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiSearchlistStateInterface): UiSearchlistStateInterface {

    const newState = {
      ...state,
    };

    // Set searchlist
    if (this.payload.searchlist !== null && !newState[this.payload.uid]) {

      newState[this.payload.uid] = {
        ...this.payload.searchlist,
      };
    }

    // Unset searchlist
    if (this.payload.searchlist === null && !!newState[this.payload.uid]) {

      delete newState[this.payload.uid];
    }

    return newState;
  }
}
