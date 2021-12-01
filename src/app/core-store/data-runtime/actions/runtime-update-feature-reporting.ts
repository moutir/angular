import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureReportingInterface } from '../../../shared/interface/runtime-feature-reporting.interface';

export class RuntimeUpdateFeatureReporting implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature reporting';
  readonly type: string = RuntimeUpdateFeatureReporting.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureReporting: RuntimeFeatureReportingInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureReporting: {
        ...this.payload.featureReporting,
      },
    };
  }
}
