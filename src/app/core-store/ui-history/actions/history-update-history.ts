import { FEATURE_NAME, UiHistoryStateInterface } from '../state';
import { HistoryInterface } from '../../../shared/interface/history.interface';
import { ActionUpdateInterface } from '../../action-update.interface';

export class HistoryUpdateHistory implements ActionUpdateInterface<UiHistoryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update history';
  readonly type: string = HistoryUpdateHistory.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    history: HistoryInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiHistoryStateInterface): UiHistoryStateInterface {

    return {
      ...state,
      history: {
        ...state.history,
        ...this.payload.history,
      },
    };
  }
}
