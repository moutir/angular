import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeFeatureAccountInterface } from '../../../shared/interface/runtime-feature-account.interface';

export class RuntimeUpdateFeatureAccount implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update feature account';
  readonly type: string = RuntimeUpdateFeatureAccount.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    featureAccount: RuntimeFeatureAccountInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      featureAccount: {
        ...this.payload.featureAccount,
      },
    };
  }
}
