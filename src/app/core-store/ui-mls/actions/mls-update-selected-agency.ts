import { FEATURE_NAME, UiMlsStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { AgencyModel } from '../../../shared/model/agency.model';

export class MlsUpdateSelectedAgency implements ActionUpdateInterface<UiMlsStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update selected agency';
  readonly type: string = MlsUpdateSelectedAgency.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agency: AgencyModel;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiMlsStateInterface): UiMlsStateInterface {

    return {
      ...state,
      selectedAgency: this.payload.agency,
    };
  }
}
