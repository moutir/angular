import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureTaskInterface } from '../../../shared/interface/runtime-feature-task.interface';

export class RuntimeUpdateFeatureTask implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature task';
  readonly type: string = RuntimeUpdateFeatureTask.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureTask: RuntimeFeatureTaskInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureTask: {
        ...this.payload.featureTask,
      },
    };
  }
}
