import { DataUploadStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class UploadUpdateByUploaderId implements ActionUpdateInterface<DataUploadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update by uploader ID';
  readonly type: string = UploadUpdateByUploaderId.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uploaderId: string;
    uploadIds: string[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataUploadStateInterface): DataUploadStateInterface {

    const newState = {
      ...state,
      byUploaderId: {
        ...state.byUploaderId,
      },
    };

    newState.byUploaderId[this.payload.uploaderId] = this.payload.uploadIds;

    return newState;
  }
}
