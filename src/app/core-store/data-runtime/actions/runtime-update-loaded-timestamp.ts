import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

export class RuntimeUpdateLoadedTimestamp implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update loaded timestamp';
  readonly type: string = RuntimeUpdateLoadedTimestamp.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    loadedTimestamp: {
      [key in RuntimeDataEnum]?: number;
    };
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      loadedTimestamp: {
        ...this.payload.loadedTimestamp,
      },
    };
  }
}
