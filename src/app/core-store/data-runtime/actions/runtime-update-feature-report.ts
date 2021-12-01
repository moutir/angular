import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureReportInterface } from '../../../shared/interface/runtime-feature-report.interface';

export class RuntimeUpdateFeatureReport implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature report';
  readonly type: string = RuntimeUpdateFeatureReport.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureReport: RuntimeFeatureReportInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureReport: {
        ...this.payload.featureReport,
      },
    };
  }
}
