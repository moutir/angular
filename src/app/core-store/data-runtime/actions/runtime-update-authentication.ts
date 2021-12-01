import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';

export class RuntimeUpdateAuthentication implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update authentication';
  readonly type: string = RuntimeUpdateAuthentication.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    authentication: RuntimeAuthenticationInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      authentication: {
        ...this.payload.authentication,
      },
    };
  }
}
