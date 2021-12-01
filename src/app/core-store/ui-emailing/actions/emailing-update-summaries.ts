import { FEATURE_NAME, UiEmailingStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RecipientSummaryInterface } from '../../../shared/interface/recipient-summary.interface';

export class EmailingUpdateSummaries implements ActionUpdateInterface<UiEmailingStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update summaries';
  readonly type: string = EmailingUpdateSummaries.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    summaries: RecipientSummaryInterface[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiEmailingStateInterface): UiEmailingStateInterface {

    return {
      ...state,
      summaries: this.payload.summaries,
    };
  }
}
