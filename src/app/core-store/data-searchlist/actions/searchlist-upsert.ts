import { ActionUpdateInterface } from '../../action-update.interface';
import { DataSearchlistStateInterface, FEATURE_NAME } from '../state';

export class SearchlistUpsert implements ActionUpdateInterface<DataSearchlistStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = SearchlistUpsert.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    hash: string;
    total: number;
    ids: string[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataSearchlistStateInterface): DataSearchlistStateInterface {

    const newState = {
      ...state,
    };

    newState[this.payload.hash] = {
      total: this.payload.total,
      ids: this.payload.ids.slice(0),
    };

    return newState;
  }
}
