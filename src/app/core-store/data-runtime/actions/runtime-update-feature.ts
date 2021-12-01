import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';

export class RuntimeUpdateFeature implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature';
  readonly type: string = RuntimeUpdateFeature.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    feature: RuntimeFeatureInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      feature: {
        ...this.payload.feature,
      },
    };
  }
}
