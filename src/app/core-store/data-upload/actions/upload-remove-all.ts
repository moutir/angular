import { DataUploadStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class UploadRemoveAll implements ActionUpdateInterface<DataUploadStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': remove all';
  readonly type: string = UploadRemoveAll.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataUploadStateInterface): DataUploadStateInterface {

    return {
      ...state,
      models: {},
    };
  }
}
