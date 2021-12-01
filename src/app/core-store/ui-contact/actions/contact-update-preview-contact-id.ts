import { FEATURE_NAME, UiContactStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class ContactUpdatePreviewContactId implements ActionUpdateInterface<UiContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update preview contact ID';
  readonly type: string = ContactUpdatePreviewContactId.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      previewContactId: string;
    },
  ) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiContactStateInterface): UiContactStateInterface {

    return {
      ...state,
      previewContactId: this.payload.previewContactId,
    };
  }
}
