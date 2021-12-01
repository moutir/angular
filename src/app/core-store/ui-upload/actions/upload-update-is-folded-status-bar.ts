import { FEATURE_NAME, UiUploadStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class UploadUpdateIsFoldedStatusBar implements ActionUpdateInterface<UiUploadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is folded status bar';
  readonly type: string = UploadUpdateIsFoldedStatusBar.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isFoldedStatusBar: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiUploadStateInterface): UiUploadStateInterface {

    const newState = {
      ...state,
      isFoldedStatusBar: this.payload.isFoldedStatusBar,
    };

    return newState;
  }
}
