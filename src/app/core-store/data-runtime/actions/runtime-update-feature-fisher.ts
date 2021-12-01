import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureFisherInterface } from '../../../shared/interface/runtime-feature-fisher.interface';

export class RuntimeUpdateFeatureFisher implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature fisher';
  readonly type: string = RuntimeUpdateFeatureFisher.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureFisher: RuntimeFeatureFisherInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureFisher: {
        ...this.payload.featureFisher,
      },
    };
  }
}
