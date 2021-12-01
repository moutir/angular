import { FEATURE_NAME, UiFormStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { GeneralErrorInterface } from '../../../shared/interface/general-error.interface';

export class FormUpdateGeneralError implements ActionUpdateInterface<UiFormStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update general error';
  readonly type: string = FormUpdateGeneralError.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    generalError: GeneralErrorInterface[];
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
      generalError: this.payload.generalError.slice(0),
    };

    return newState;
  }
}
