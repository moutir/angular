import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeSettingsInterface } from '../../../shared/interface/runtime-settings.interface';

export class RuntimeUpdateSettings implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update settings';
  readonly type: string = RuntimeUpdateSettings.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    settings: RuntimeSettingsInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      settings: {
        ...this.payload.settings,
      },
    };
  }
}
