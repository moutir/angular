import { FEATURE_NAME, UiDocumentStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { DocumentInterface } from '../../../shared/interface/document.interface';

export class DocumentSet implements ActionUpdateInterface<UiDocumentStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': set';
  readonly type: string = DocumentSet.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    document: DocumentInterface|null;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiDocumentStateInterface): UiDocumentStateInterface {

    const newState = {
      ...state,
    };

    // Set document
    if (this.payload.document !== null && !newState[this.payload.uid]) {

      newState[this.payload.uid] = {
        ...this.payload.document,
      };
    }

    // Unset document
    if (this.payload.document === null && !!newState[this.payload.uid]) {

      delete newState[this.payload.uid];
    }

    return newState;
  }
}
