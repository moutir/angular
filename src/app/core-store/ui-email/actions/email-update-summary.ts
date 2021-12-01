import { FEATURE_NAME, UiEmailStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { EmailSummaryInterface } from '../../../shared/interface/email-summary.interface';

export class EmailUpdateSummary implements ActionUpdateInterface<UiEmailStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update summary';
  readonly type: string = EmailUpdateSummary.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    summary: EmailSummaryInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiEmailStateInterface): UiEmailStateInterface {

    return {
      ...state,
      summary: {
        ...state.summary,
        ...this.payload.summary,
      },
    };
  }
}
