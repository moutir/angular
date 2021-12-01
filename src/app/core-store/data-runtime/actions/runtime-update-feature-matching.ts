import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureMatchingInterface } from '../../../shared/interface/runtime-feature-matching.interface';

export class RuntimeUpdateFeatureMatching implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature matching';
  readonly type: string = RuntimeUpdateFeatureMatching.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureMatching: RuntimeFeatureMatchingInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureMatching: {
        ...this.payload.featureMatching,
      },
    };
  }
}
