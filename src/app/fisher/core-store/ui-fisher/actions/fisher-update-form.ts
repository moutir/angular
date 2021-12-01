import { FEATURE_NAME, UiFisherStateInterface } from '../state';
import { FisherInterface } from '../../../shared/interface/fisher.interface';
import { ActionUpdateInterface } from '../../../../core-store/action-update.interface';

export class FisherUpdateForm implements ActionUpdateInterface<UiFisherStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update form';
  readonly type: string = FisherUpdateForm.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    form: Partial<FisherInterface>;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiFisherStateInterface): UiFisherStateInterface {

    return {
      ...state,
      form: {
        ...state.form,
        ...this.payload.form,
      },
    };
  }
}
