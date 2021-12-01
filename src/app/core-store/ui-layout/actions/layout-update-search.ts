import { FEATURE_NAME, UiLayoutStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { HeaderSearchInterface } from '../../../shared/interface/header-search.interface';

export class LayoutUpdateSearch implements ActionUpdateInterface<UiLayoutStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update search';
  readonly type: string = LayoutUpdateSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    search: HeaderSearchInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiLayoutStateInterface): UiLayoutStateInterface {

    return {
      ...state,
      search: this.payload.search,
    };
  }
}
