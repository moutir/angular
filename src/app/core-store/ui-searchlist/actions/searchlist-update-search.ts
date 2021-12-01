import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { SearchlistSearchInterface } from '../../../shared/interface/searchlist-search.interface';

export class SearchlistUpdateSearch implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update search';
  readonly type: string = SearchlistUpdateSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    search: SearchlistSearchInterface;
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
      search: {
        ...this.payload.search,
      },
    };

    return newState;
  }
}
