import { DataMlsStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { AgencyModel } from '../../../shared/model/agency.model';

export class MlsUpdateAgencies implements ActionUpdateInterface<DataMlsStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update agencies';
  readonly type: string = MlsUpdateAgencies.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agencies: AgencyModel[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataMlsStateInterface): DataMlsStateInterface {

    return {
      ...state,
      agencies: this.payload.agencies,
    };
  }
}
