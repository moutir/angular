import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureBrochureInterface } from '../../../shared/interface/runtime-feature-brochure.interface';

export class RuntimeUpdateFeatureBrochure implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature brochure';
  readonly type: string = RuntimeUpdateFeatureBrochure.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureBrochure: RuntimeFeatureBrochureInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureBrochure: {
        ...this.payload.featureBrochure,
      },
    };
  }
}
