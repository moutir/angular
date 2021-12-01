import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';

export class RuntimeUpdateUserPreference implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update user preference';
  readonly type: string = RuntimeUpdateUserPreference.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    userPreference: RuntimeUserPreferenceInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      userPreference: {
        ...this.payload.userPreference,
      },
    };
  }
}
