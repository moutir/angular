import { FEATURE_NAME, UiAgencyProfileStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { AgencyEmailPreviewInterface } from '../../../shared/interface/agency-email-preview.interface';

export class AgencyProfileUpdateEmailPreview implements ActionUpdateInterface<UiAgencyProfileStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update email preview';
  readonly type: string = AgencyProfileUpdateEmailPreview.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    emailPreview: AgencyEmailPreviewInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiAgencyProfileStateInterface): UiAgencyProfileStateInterface {

    return {
      ...state,
      emailPreview: this.payload.emailPreview,
    };
  }
}
