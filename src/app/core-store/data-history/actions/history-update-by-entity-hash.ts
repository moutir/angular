import { DataHistoryStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class HistoryUpdateByEntityHash implements ActionUpdateInterface<DataHistoryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update by entity hash';
  readonly type: string = HistoryUpdateByEntityHash.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    hash: string;
    historyIds: string[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataHistoryStateInterface): DataHistoryStateInterface {

    const newState = {
      ...state,
      byEntityHash: {
        ...state.byEntityHash,
      },
    };

    newState.byEntityHash[this.payload.hash] = this.payload.historyIds;

    return newState;
  }
}
