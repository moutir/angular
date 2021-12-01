import { FEATURE_NAME, UiFormStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { UiFormInterface } from '../ui-form.interface';

export class FormSet implements ActionUpdateInterface<UiFormStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': set';
  readonly type: string = FormSet.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    form: UiFormInterface|null;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiFormStateInterface): UiFormStateInterface {

    const newState = {
      ...state,
    };

    // Set form
    if (this.payload.form !== null) {

      newState[this.payload.uid] = {
        ...this.payload.form,
      };
    }

    // Unset form
    if (this.payload.form === null && !!newState[this.payload.uid]) {

      delete newState[this.payload.uid];
    }

    return newState;
  }
}
