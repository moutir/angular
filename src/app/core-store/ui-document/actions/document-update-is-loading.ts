import { FEATURE_NAME, UiDocumentStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class DocumentUpdateIsLoading implements ActionUpdateInterface<UiDocumentStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is loading';
  readonly type: string = DocumentUpdateIsLoading.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    isLoading: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiDocumentStateInterface): UiDocumentStateInterface {

    const newState = {
      ...state,
    };

    newState[this.payload.uid] = {
      ...state[this.payload.uid],
      isLoading: this.payload.isLoading,
    };

    return newState;
  }
}
