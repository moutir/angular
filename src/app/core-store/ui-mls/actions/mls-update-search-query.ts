import { FEATURE_NAME, UiMlsStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class MlsUpdateSearchQuery implements ActionUpdateInterface<UiMlsStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update search query';
  readonly type: string = MlsUpdateSearchQuery.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    searchQuery: string;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMlsStateInterface): UiMlsStateInterface {

    return {
      ...state,
      searchQuery: this.payload.searchQuery,
    };
  }
}
