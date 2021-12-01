import { FEATURE_NAME, UiFormStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { KeyValueType } from '../../../shared/type/key-value.type';

export class FormUpdateModelError implements ActionUpdateInterface<UiFormStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update model error';
  readonly type: string = FormUpdateModelError.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    modelError: KeyValueType<string, string|null>;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiFormStateInterface): UiFormStateInterface {

    const newState = {
      ...state,
    };

    newState[this.payload.uid] = {
      ...state[this.payload.uid],
      modelError: this.payload.modelError,
    };

    return newState;
  }
}
