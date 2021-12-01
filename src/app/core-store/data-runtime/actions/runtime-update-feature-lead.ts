import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureLeadInterface } from '../../../shared/interface/runtime-feature-lead.interface';

export class RuntimeUpdateFeatureLead implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature lead';
  readonly type: string = RuntimeUpdateFeatureLead.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureLead: RuntimeFeatureLeadInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureLead: {
        ...this.payload.featureLead,
      },
    };
  }
}
