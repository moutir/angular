import { FEATURE_NAME, UiRuntimeStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ContextualInterface } from '../../../shared/interface/contextual.interface';

export class RuntimeUpdateContextual implements ActionUpdateInterface<UiRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update contextual';
  readonly type: string = RuntimeUpdateContextual.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contextual: ContextualInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiRuntimeStateInterface): UiRuntimeStateInterface {

    return {
      ...state,
      contextual: {
        ...this.payload.contextual,
      },
    };
  }
}
