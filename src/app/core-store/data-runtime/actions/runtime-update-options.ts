import { DataRuntimeStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

export class RuntimeUpdateOptions implements ActionUpdateInterface<DataRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update options';
  readonly type: string = RuntimeUpdateOptions.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    options: RuntimeOptionsInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataRuntimeStateInterface): DataRuntimeStateInterface {

    return {
      ...state,
      options: {
        ...this.payload.options,
      },
    };
  }
}
