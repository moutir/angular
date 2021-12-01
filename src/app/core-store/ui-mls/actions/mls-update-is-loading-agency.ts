import { FEATURE_NAME, UiMlsStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class MlsUpdateIsLoadingAgency implements ActionUpdateInterface<UiMlsStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is loading agency';
  readonly type: string = MlsUpdateIsLoadingAgency.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isLoading: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMlsStateInterface): UiMlsStateInterface {

    return {
      ...state,
      isLoadingAgency: this.payload.isLoading,
    };
  }
}
