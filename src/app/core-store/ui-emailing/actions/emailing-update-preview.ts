import { FEATURE_NAME, UiEmailingStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { EmailingPreviewInterface } from '../../../shared/interface/emailing-preview.interface';

export class EmailingUpdatePreview implements ActionUpdateInterface<UiEmailingStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update preview';
  readonly type: string = EmailingUpdatePreview.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    preview: EmailingPreviewInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiEmailingStateInterface): UiEmailingStateInterface {

    return {
      ...state,
      preview: this.payload.preview,
    };
  }
}
