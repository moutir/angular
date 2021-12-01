import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeAgencyPreferenceInterface } from '../../../shared/interface/runtime-agency-preference.interface';

export class RuntimeUpdateAgencyPreference implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update agency preference';
  readonly type: string = RuntimeUpdateAgencyPreference.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agencyPreference: RuntimeAgencyPreferenceInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      agencyPreference: {
        ...this.payload.agencyPreference,
      },
    };
  }
}
