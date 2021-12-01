import { FEATURE_NAME, UiSearchlistStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';

export class SearchlistUpdateForm implements ActionUpdateInterface<UiSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update form';
  readonly type: string = SearchlistUpdateForm.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    form: ListFiltersInterface;
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
      form: {
        ...this.payload.form,
      },
    };

    return newState;
  }
}
